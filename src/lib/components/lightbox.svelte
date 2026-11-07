<script lang="ts">
  import { Button } from "#lib/components/ui/button/index.ts";
  import * as Card from "#lib/components/ui/card/index.ts";
  import { Separator } from "#lib/components/ui/separator/index.ts";
  import ImageUp from "@lucide/svelte/icons/image-up";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import Zap from "@lucide/svelte/icons/zap";
  import PencilLine from "@lucide/svelte/icons/pencil-line";
  import Server from "@lucide/svelte/icons/server";
  import Timer from "@lucide/svelte/icons/timer";
  import * as Item from "#lib/components/ui/item/index.js";
  import { Spinner } from "#lib/components/ui/spinner/index.js";
  import { Input } from "#lib/components/ui/input/index.ts";
  import { Badge } from "#lib/components/ui/badge/index.ts";
  import * as AlertDialog from "#lib/components/ui/alert-dialog/index.ts";
  import * as Tooltip from "#lib/components/ui/tooltip/index.js";
  import { tick } from "svelte";
  import init, {
    LightboxEditorHandle,
    LightboxEditorSession,
    lightbox_image_editor_session,
  } from "@sb-child/sbchild-top-wasm";
  // 显式传入 wasm 资源 URL：默认的 new URL(..., import.meta.url) 经过 Vite 预打包后会失效。
  import wasm_url from "@sb-child/sbchild-top-wasm/sbchild_top_wasm_bg.wasm?url";
  import Slider from "./ui/slider/slider.svelte";
  import Label from "./ui/label/label.svelte";

  const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  type LabeledSliderOptions = {
    id: string;
    label: string;
    /** 读取当前值（渲染时调用，能正常追踪 $state） */
    get: () => number;
    set: (value: number) => void;
    /** 默认值，也是“重置”回到的值 */
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
  };

  // ---- 提示弹窗 ----

  let isAlertOpen = $state(false);
  let alertTitle = $state("");
  let alertContent = $state("");

  function show_alert(title: string, content: string) {
    alertTitle = title;
    alertContent = content;
    isAlertOpen = true;
  }

  // ---- 表单状态（已确认的结果） ----

  /** 已确认的图片；编辑被取消时不会清空 */
  let stored_file_name = $state<string | null>(null);
  let stored_webp = $state<Uint8Array | null>(null);

  let file_input = $state<HTMLInputElement | null>(null);

  // ---- 编辑器状态（临时） ----

  /** 正在编辑的文件；确定或取消后清空 */
  let editing_file = $state<File | null>(null);
  let isEditorOpen = $state(false);
  let editorTitle = $state("");
  let editorXOffset = $state(0.0);
  let editorYOffset = $state(0.0);
  let editorScale = $state(1.0);
  let canvas = $state<HTMLCanvasElement | null>(null);

  /** wasm 0.2.0：session 按值传入后即失效，命令一律走 handle */
  let editor_handle: LightboxEditorHandle | null = null;
  let editor_ready = $state(false);
  /** 作废“上一轮还挂在 await 上”的会话 */
  let run_id = 0;
  /** 点“确定”时置 true，避免关弹窗时又发 cancel */
  let skip_cancel = false;

  // ---- wasm ----

  let wasm_loading: Promise<void> | null = null;

  function ensure_wasm() {
    wasm_loading ??= init({ module_or_path: wasm_url }).then(() => undefined);
    return wasm_loading.catch((err) => {
      // 加载失败后允许下次重试
      wasm_loading = null;
      throw err;
    });
  }

  async function wait_for_canvas() {
    // 弹窗内容（含 canvas）要等下一帧才挂载
    for (let i = 0; i < 5 && !canvas; i++) {
      await tick();
    }
    return canvas;
  }

  // ---- 编辑器流程 ----

  async function start_editing(file: File) {
    const canvas_el = await wait_for_canvas();
    // 等画布 / wasm 的过程中用户可能已经把弹窗关掉了
    if (!canvas_el || !isEditorOpen) {
      return;
    }

    try {
      await ensure_wasm();
    } catch (err) {
      show_alert("图像处理模块加载失败", String(err));
      return;
    }

    if (!isEditorOpen) {
      return;
    }

    const run = ++run_id;
    // 上一轮如果还在等 confirm/cancel，先让它以 undefined 结束
    editor_handle?.cancel();

    const session = new LightboxEditorSession();
    // handle 必须在 session 传给编辑函数之前创建
    const handle = session.handle();
    editor_handle = handle;
    editor_ready = true;

    let output: Uint8Array | undefined;
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      // session 按值传入后 JS 侧失效（不要再调用它，也不要 free）
      // 这个 Promise 到 confirm() 才返回 WebP，cancel() 则返回 undefined
      output = await lightbox_image_editor_session(canvas_el, session, data);
    } catch (err) {
      // wasm 抛的是字符串，不是 Error
      if (run === run_id) {
        show_alert("图片处理失败", String(err));
      }
    } finally {
      handle.free();
      if (run === run_id) {
        // 会话结束（确定 / 取消 / 出错）后清理临时态
        editor_handle = null;
        editor_ready = false;
        editing_file = null;
        skip_cancel = false;
      }
    }

    if (output) {
      // confirm 成功：结果先留在表单状态里，真正上传留给“发布”
      stored_file_name = file.name;
      stored_webp = output;
    }
  }

  // 滑块变化时把参数推给 wasm，重新裁剪并刷新预览
  $effect(() => {
    const settings = {
      scale: editorScale,
      offset_x: editorXOffset,
      offset_y: editorYOffset,
    };
    if (!editor_ready || !editor_handle) {
      return;
    }
    try {
      // serde 反序列化要求三个字段齐全
      editor_handle.update_settings(settings);
    } catch (err) {
      show_alert("参数错误", String(err));
    }
  });

  // ---- 事件处理 ----

  function on_select_image_file() {
    file_input?.click();
  }

  function on_image_file_change(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0] ?? null;
    // 清空 value，保证再次选择同一个文件时也能触发 change
    input.value = "";

    if (!file) {
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      show_alert("文件类型不支持", "请选择 PNG、JPEG 或 WebP 格式的图片。");
      return;
    }

    editing_file = file;
    editorTitle = `编辑 ${file.name}`;
    editorXOffset = 0.0;
    editorYOffset = 0.0;
    editorScale = 1.0;
    skip_cancel = false;
    isEditorOpen = true;
    void start_editing(file);
  }

  function on_editor_open_change(open: boolean) {
    if (open) {
      return;
    }
    // 取消 / Esc / 点遮罩都会走到这里，让会话正常结束
    if (!skip_cancel) {
      editor_handle?.cancel();
    }
    // 只清临时态，已确认的 stored_* 保持不变
    editing_file = null;
    skip_cancel = false;
  }

  function on_editor_confirm() {
    skip_cancel = true;
    editor_handle?.confirm();
    // 父组件直接设 isEditorOpen 不会触发 onOpenChange，这里手动清临时态
    isEditorOpen = false;
    editing_file = null;
  }

  /** 重置表单：清除已确认的结果 */
  function on_reset_form() {
    stored_file_name = null;
    stored_webp = null;
    editing_file = null;
  }

  /** 占位：发布时把 stored_webp 交给上传 API */
  function on_publish() {
    if (!stored_webp) {
      return;
    }
    // TODO: 上传 stored_webp（文件名见 stored_file_name）
  }
</script>

{#snippet labeled_slider(options: LabeledSliderOptions)}
  <div class="flex items-center justify-between gap-2">
    <Label for={options.id}>{options.label}</Label>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{options.get()}</span>
      <Button
        variant="outline"
        size="xs"
        onclick={() => options.set(options.defaultValue ?? 0)}
        disabled={options.get() == (options.defaultValue ?? 0)}
        ><RotateCcw />重置</Button
      >
    </div>
  </div>
  <Slider
    type="single"
    id={options.id}
    value={options.get()}
    onValueChange={options.set}
    min={options.min ?? -1}
    step={options.step ?? 0.01}
    max={options.max ?? 1}
    class="mx-auto w-full"
  />
{/snippet}

<AlertDialog.Root bind:open={isAlertOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{alertTitle}</AlertDialog.Title>
      <AlertDialog.Description>{alertContent}</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>好的</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={isEditorOpen} onOpenChange={on_editor_open_change}>
  <AlertDialog.Content
    class="max-w-2xl! max-h-[85dvh] overflow-y-auto overscroll-contain"
  >
    <AlertDialog.Header>
      <AlertDialog.Title>{editorTitle}</AlertDialog.Title>
    </AlertDialog.Header>
    <div>
      <!-- 编辑器组件 -->
      <div class="flex flex-col gap-2">
        <div
          class="aspect-4/3 w-full overflow-hidden rounded-lg bg-transparent"
        >
          <canvas bind:this={canvas} class="block size-full"></canvas>
        </div>
        <Card.Root class="w-full">
          <Card.Content class="space-y-2">
            {@render labeled_slider({
              id: "lightbox-editor-x-offset",
              label: "水平方向位移",
              get: () => editorXOffset,
              set: (value) => (editorXOffset = value),
            })}
            {@render labeled_slider({
              id: "lightbox-editor-y-offset",
              label: "垂直方向位移",
              get: () => editorYOffset,
              set: (value) => (editorYOffset = value),
            })}
            {@render labeled_slider({
              id: "lightbox-editor-scale",
              label: "缩放",
              get: () => editorScale,
              set: (value) => (editorScale = value),
              min: 1.0,
              max: 4.0,
              step: 0.01,
              defaultValue: 1.0,
            })}
          </Card.Content>
        </Card.Root>
      </div>
    </div>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>取消</AlertDialog.Cancel>
      <AlertDialog.Action onclick={on_editor_confirm} disabled={!editor_ready}
        >确定</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
  <div class="lg:col-span-2">
    <Card.Root class="w-full">
      <Card.Content class="relative">
        <Item.Root
          variant="muted"
          class="absolute top-1 left-5 w-[calc(100%-40px)]"
        >
          <Item.Media>
            <Spinner />
          </Item.Media>
          <Item.Content>
            <Item.Title class="line-clamp-1">正在获取数据...</Item.Title>
          </Item.Content>
        </Item.Root>
        <div class="aspect-4/3 object-cover bg-amber-600 rounded-lg">
          (4/3图片)
        </div>
        <Badge
          variant="secondary"
          class="absolute bottom-1 left-5 opacity-80"
          href="https://mini-tools.uk/?lang=zh-CN"
          rel="noopener"
          target="_blank"
        >
          <Server />Mini-Tools 免费图床
        </Badge>
      </Card.Content>
      <Card.Footer>
        <div class="flex flex-wrap items-center gap-2 md:flex-row">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Badge variant="default">
                  <Timer />内容 7天 后过期
                </Badge>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <div>
                  <p>发布 2026-10-10 11:11:11 +8</p>
                  <p>过期 2026-10-17 11:11:11 +8</p>
                </div>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>

          <p>色妹妹公益灯箱，本站精选图片，希望你会喜欢。</p>
        </div>
      </Card.Footer>
    </Card.Root>
  </div>

  <div>
    <Card.Root class="w-full">
      <Card.Header>
        <Card.Title>灯箱控制面板</Card.Title>
        <Card.Description
          >如果你对图片有意见你可以撤掉换成你喜欢的。</Card.Description
        >
      </Card.Header>
      <Card.Content class="flex flex-col items-start gap-1">
        <p>
          你的更改将立刻生效然后被所有浏览者看到，不过你不需要任何代价也不需要任何权限就可以更改你面前展示的内容。
        </p>
        <Badge variant="secondary">
          <PencilLine />今日还能修改 50 次。
        </Badge>
        <Separator />
        <p>选择你中意的图片吧：</p>
        <input
          bind:this={file_input}
          class="hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onchange={on_image_file_change}
        />
        <Button variant="outline" onclick={on_select_image_file}
          ><ImageUp />选择图片...</Button
        >
        {#if editing_file}
          <p class="text-sm text-muted-foreground break-all">
            正在编辑：{editing_file.name}
          </p>
        {:else if stored_file_name}
          <p class="text-sm text-muted-foreground break-all">
            已选择：{stored_file_name}
          </p>
        {/if}
        <Separator />
        <p>填写新图片的标题，它会显示在图片上方：</p>
        <Input
          id="input-image-title"
          type="text"
          placeholder="一只可爱的猫娘！"
        />
        <Separator />
        <p>
          最后，点击<b>发布</b>按钮应用你的方案。或者点击<b>重置表单</b
          >按钮重新来过：
        </p>
      </Card.Content>
      <Card.Footer>
        <div class="flex flex-wrap items-center gap-2 md:flex-row">
          <Button variant="default" onclick={on_publish} disabled={!stored_webp}
            ><Zap />发布</Button
          >
          <Button variant="outline" onclick={on_reset_form}
            ><RotateCcw />重置表单</Button
          >
        </div>
      </Card.Footer>
    </Card.Root>
  </div>
</div>

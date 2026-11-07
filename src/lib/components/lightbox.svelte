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
  import { lightbox_image_editor_session } from "@sb-child/sbchild-top-wasm";
  import Slider from "./ui/slider/slider.svelte";
  import Label from "./ui/label/label.svelte";

  let isAlertOpen = $state(false);
  let alertTitle = $state("");
  let alertContent = $state("");
  let isEditorOpen = $state(false);
  let editorTitle = $state("");
  let editorXOffset = $state(0.0);
  let editorYOffset = $state(0.0);
  let editorScale = $state(1.0);

  const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  let file_input = $state<HTMLInputElement | null>(null);
  let selected_file = $state<File | null>(null);

  type LabeledSliderOptions = {
    id: string;
    label: string;
    /** 读取当前值（在渲染时调用，能正常追踪响应式依赖） */
    get: () => number;
    set: (value: number) => void;
    /** 默认值（也是点“重置”回到的值），默认 0 */
    defaultValue?: number;
    /** 取值范围和步长，默认 -1 ~ 1，步长 0.01 */
    min?: number;
    max?: number;
    step?: number;
  };

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
      alertTitle = "文件类型不支持";
      alertContent = "请选择 PNG、JPEG 或 WebP 格式的图片。";
      isAlertOpen = true;
      return;
    }

    selected_file = file;
    console.log("Selected file:", file);
    editorTitle = `编辑 ${file.name}`;
    isEditorOpen = true;
    // lightbox_image_editor_session()
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
      <!-- <AlertDialog.Action>Continue</AlertDialog.Action> -->
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={isEditorOpen}>
  <AlertDialog.Content
    class="max-w-2xl! max-h-[85dvh] overflow-y-auto overscroll-contain"
  >
    <AlertDialog.Header>
      <AlertDialog.Title>{editorTitle}</AlertDialog.Title>
      <!-- <AlertDialog.Description>{alertContent}</AlertDialog.Description> -->
    </AlertDialog.Header>
    <div>
      <!-- 编辑器组件 -->
      <div class="flex flex-col gap-2">
        <div class="aspect-4/3 w-full bg-amber-600 rounded-lg">(4/3图片)</div>
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
      <AlertDialog.Action>确定</AlertDialog.Action>
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
        {#if selected_file}
          <p class="text-sm text-muted-foreground break-all">
            已选择：{selected_file.name}
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
          <Button variant="default"><Zap />发布</Button>
          <Button variant="outline"><RotateCcw />重置表单</Button>
        </div>
      </Card.Footer>
    </Card.Root>
  </div>
</div>

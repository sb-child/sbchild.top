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
  import * as Tooltip from "#lib/components/ui/tooltip/index.js";
</script>

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
                <Badge variant="secondary">
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
        <Button variant="outline"><ImageUp />选择图片...</Button>
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

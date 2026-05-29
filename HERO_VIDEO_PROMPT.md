# T-GEO 背景视频生成指南（GEO 主题 · 可直接替换）

> 你的 demo 之前用的是 VaultShield 示例里那段 CloudFront 视频，跟「本地生活 AI 搜索推荐」毫无关系。
> 下面这段 prompt 专为 T-GEO 主题写，生成后按文末步骤替换即可，**代码无需改动**。

---

## 一、推荐技术参数（喂给 Sora / Runway / Kling / Veo / 即梦 等）

- 时长：8–12 秒，**无缝循环 (seamless loop)**，首尾画面一致
- 比例：**16:9 横版**（1920×1080 或更高）
- 帧率：24–30fps
- 调性：暗黑高级 + 金色点缀，与站点主色 `#C5A059`（香槟金）/ `#020203`（近黑）一致
- **画面里不要出现任何文字、字幕、Logo、水印、人脸、品牌名**（站点会叠加自己的 HUD 文案）
- 运镜：缓慢、电影感，轻微推进或横移，不要快切、不要抖动
- 留出中间偏暗的负空间，便于叠加登录卡片与标题

---

## 二、英文生成 Prompt（直接复制使用）

```
A cinematic, abstract sci-fi background loop visualizing an "AI search visibility engine"
for local businesses. Deep near-black background (#020203) with champagne-gold (#C5A059)
and faint electric-blue accents. A vast 3D knowledge graph slowly rotates in dark space:
glowing golden nodes connected by thin luminous synapse lines, with small light packets
flowing along the connections toward five brighter pulsing "AI engine" core orbs. Below,
a faint holographic wireframe city map with softly glowing location pins lighting up one
by one like discovered coordinates, and a slow radar sweep arc rotating across the scene.
Thin streams of light particles drift from the edges toward the glowing cores, suggesting
search queries being routed and ranked. Subtle vertical ranking bars rise gently in the
background haze. Volumetric depth, soft bokeh, fine grain, faint CRT scanlines, elegant
and premium, like a high-end fintech / AI product hero. Extremely slow dolly-in camera
move. No text, no logos, no faces, no UI. Seamless loop, 16:9, dark moody luxury tech.
```

### 可选风格微调
- 想更冷：把 `electric-blue` 提到主导，金色作点缀。
- 想更暖/餐饮感：加 `with occasional warm amber embers drifting upward`。
- 想更「地图/本地」：把 `holographic wireframe city map` 换成 `a stylized topographic map of a city grid with glowing district outlines`。

---

## 三、中文 Prompt（部分国产工具更吃中文）

```
电影感科幻抽象循环背景，表现「本地生活商家的 AI 搜索可见度引擎」。
近黑色背景(#020203)，香槟金(#C5A059)为主色，点缀微弱电光蓝。
深空中缓缓旋转的三维知识图谱：发光的金色节点由纤细的发光神经突触连线相连，
光点数据包沿连线流向五个更亮、有脉冲呼吸感的「AI 大模型核心」光球。
下方是若隐若现的全息线框城市地图，地理光点像被逐一「发现」的坐标依次点亮，
一道缓慢的雷达扫描弧线扫过画面。细密的光粒子从画面边缘流向核心光球，
暗示搜索意图被路由与排名。背景薄雾中有缓缓上升的细长排名柱状条。
体积光、柔焦虚化、细颗粒、淡淡 CRT 扫描线，高级、克制、像高端 AI 产品首屏。
极慢的镜头推进。画面中不要任何文字、Logo、人脸、UI。无缝循环，16:9，暗调奢华科技风。
```

---

## 四、生成后如何替换（30 秒搞定，无需改代码）

1. 把生成好的视频文件**重命名为 `hero.mp4`**。
2. 放到项目根目录的 **`public/` 文件夹**下，即最终路径为：`public/hero.mp4`
   （已为你建好 `public/` 目录）
3. 重新启动 / 刷新：`npm run dev` —— 登录页和所有工作台页面的背景视频会自动换成它。

> 想用别的文件名或外链 CDN？只改 `src/lib/config.ts` 里的 `HERO_VIDEO_SRC` 这一行即可。
> 如果 `public/hero.mp4` 不存在，画面会**自动优雅降级**为纯 Canvas 科幻雷达动效（依然好看，不会白屏）。

/**
 * ====== 背景视频配置 (Background Video Config) ======
 *
 * 把你在 AI 工具里生成 / 自己拍摄的「与 GEO 主题贴切」的视频文件，
 * 命名为 hero.mp4，放到项目根目录的 public/ 文件夹下（即 public/hero.mp4）。
 * Vite 会自动把它映射到站点根路径 /hero.mp4，下面无需改动即可生效。
 *
 * 想换文件名或用外链 CDN 时，只改这一行即可。
 * 若该文件不存在，画面会优雅降级为纯 Canvas 科幻动效（依然好看）。
 */
export const HERO_VIDEO_SRC = '/hero.mp4';

// 之前残留的、与项目无关的 VaultShield 示例视频（已弃用，仅作占位 fallback 备查）。
export const LEGACY_FALLBACK_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4';

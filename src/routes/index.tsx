import { createFileRoute } from "@tanstack/react-router";
import { WeldingPlatform } from "../components/welding/WeldingPlatform";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "生产总览｜弧光智造焊接平台" }, { name: "description", content: "智能焊接工厂生产态势与核心指标总览。" },
    { property: "og:title", content: "生产总览｜弧光智造" }, { property: "og:description", content: "实时掌握焊接产量、质量与设备运行态势。" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <WeldingPlatform page="overview" />,
});

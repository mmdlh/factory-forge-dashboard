import ReactECharts from "echarts-for-react";

type ChartKind = "line" | "bar" | "pie" | "radar";

const text = "#a9c3d5";
const grid = "rgba(154, 206, 230, .12)";
const cyan = "#38d9ff";
const blue = "#3184ff";
const amber = "#ffad42";
const green = "#4ee6a0";
const red = "#ff6174";

const axis = {
  axisLabel: { color: text, fontSize: 10 },
  axisLine: { lineStyle: { color: grid } },
  splitLine: { lineStyle: { color: grid } },
  axisTick: { show: false },
};

const tooltip = {
  trigger: "axis" as const,
  backgroundColor: "rgba(5, 18, 28, .92)",
  borderColor: "rgba(56, 217, 255, .42)",
  textStyle: { color: "#dff7ff" },
};

function getOption(kind: ChartKind, variant = 0) {
  if (kind === "pie") {
    return {
      tooltip: { ...tooltip, trigger: "item" },
      legend: { bottom: 0, left: "center", textStyle: { color: text }, itemWidth: 9, itemHeight: 9 },
      color: [cyan, blue, amber, green, red],
      series: [{
        type: "pie",
        radius: ["52%", "76%"],
        center: ["50%", "44%"],
        data: variant % 2
          ? [{ value: 46, name: "焊接" }, { value: 23, name: "待机" }, { value: 19, name: "维护" }, { value: 12, name: "告警" }]
          : [{ value: 68, name: "合格" }, { value: 18, name: "返修" }, { value: 9, name: "待检" }, { value: 5, name: "报废" }],
        label: { color: text, fontSize: 10 },
        itemStyle: { borderColor: "#071621", borderWidth: 3, shadowBlur: 14, shadowColor: "rgba(56,217,255,.22)" },
      }],
    };
  }

  if (kind === "radar") {
    return {
      tooltip,
      legend: { top: 4, right: 6, textStyle: { color: text } },
      color: [cyan, amber],
      radar: {
        center: ["50%", "56%"], radius: "64%", splitNumber: 4,
        indicator: ["电流稳定", "电压稳定", "送丝精度", "气体保护", "成形质量", "节拍达成"].map((name) => ({ name, max: 100 })),
        axisName: { color: text, fontSize: 10 },
        splitLine: { lineStyle: { color: grid } },
        splitArea: { areaStyle: { color: ["rgba(8,35,49,.2)", "rgba(8,35,49,.45)"] } },
        axisLine: { lineStyle: { color: grid } },
      },
      series: [{ type: "radar", data: [
        { name: "当前班次", value: [92, 88, 95, 84, 91, 89], areaStyle: { color: "rgba(56,217,255,.22)" } },
        { name: "标准基线", value: [86, 87, 88, 90, 85, 86], areaStyle: { color: "rgba(255,173,66,.12)" } },
      ] }],
    };
  }

  const labels = kind === "line" ? ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] : ["A-01", "A-02", "B-01", "B-02", "C-01", "C-02"];
  if (kind === "bar") {
    return {
      tooltip,
      legend: { top: 8, right: 8, textStyle: { color: text } },
      grid: { top: 48, right: 16, bottom: 28, left: 42 },
      xAxis: { type: "category", data: labels, ...axis },
      yAxis: { type: "value", ...axis },
      color: [cyan, amber],
      series: [
        { name: "计划", type: "bar", data: [72, 84, 76, 91, 81, 88], barWidth: 10, itemStyle: { borderRadius: [3, 3, 0, 0], opacity: .45 } },
        { name: "实际", type: "bar", data: [68, 87, 79, 86, 84, 91], barWidth: 10, itemStyle: { borderRadius: [3, 3, 0, 0] } },
      ],
    };
  }

  return {
    tooltip,
    legend: { top: 8, right: 8, textStyle: { color: text } },
    grid: { top: 50, right: 18, bottom: 28, left: 42 },
    xAxis: { type: "category", boundaryGap: false, data: labels, ...axis },
    yAxis: { type: "value", ...axis },
    color: [cyan, amber],
    series: [
      { name: variant % 2 ? "焊接电流" : "实时产出", type: "line", smooth: true, symbol: "none", data: [68, 82, 76, 94, 88, 102, 97], lineStyle: { width: 3 }, areaStyle: { color: "rgba(56,217,255,.12)" } },
      { name: variant % 2 ? "目标电流" : "计划产出", type: "line", smooth: true, symbol: "none", data: [74, 78, 81, 86, 91, 96, 101], lineStyle: { width: 2, type: "dashed" } },
    ],
  };
}

export default function WeldingChart({ kind, variant }: { kind: ChartKind; variant?: number }) {
  return <ReactECharts option={getOption(kind, variant)} notMerge className="h-full min-h-56 w-full" />;
}
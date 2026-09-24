import { ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, type CSSProperties, type ReactNode } from "react";
import {
  Activity, AlertTriangle, Bot, ChevronRight, CircleGauge, Factory, Flame,
  Gauge, HardHat, Radio, ShieldCheck, Sparkles, Wrench, Zap,
} from "lucide-react";
import factoryBackground from "../../assets/welding-factory-bg.jpg";

const WeldingChart = lazy(() => import("./WeldingChart.client"));

export type PageKey = "overview" | "machines" | "quality" | "process" | "maintenance" | "energy" | "safety";
type ChartKind = "line" | "bar" | "pie" | "radar";

const nav = [
  { to: "/", key: "overview", label: "生产总览", icon: CircleGauge },
  { to: "/machines", key: "machines", label: "焊机监控", icon: Bot },
  { to: "/quality", key: "quality", label: "质量分析", icon: ShieldCheck },
  { to: "/process", key: "process", label: "工艺管理", icon: Flame },
  { to: "/maintenance", key: "maintenance", label: "设备运维", icon: Wrench },
  { to: "/energy", key: "energy", label: "能耗中心", icon: Zap },
  { to: "/safety", key: "safety", label: "安全预警", icon: HardHat },
] as const;

const pageData: Record<PageKey, { eyebrow: string; title: string; sub: string; stats: [string, string, string, "cyan" | "amber" | "green" | "red"][] }> = {
  overview: { eyebrow: "SMART WELDING · 实时生产态势", title: "生产总览", sub: "焊接一车间 · 2026-09-24 · 早班", stats: [["今日产量", "1,286", "件 · +12.8%", "cyan"], ["一次合格率", "98.6", "% · +0.7%", "green"], ["运行设备", "42/46", "台 · 91.3%", "amber"], ["平均节拍", "43.2", "秒 · -2.1秒", "cyan"]] },
  machines: { eyebrow: "DEVICE MATRIX · 46 台联网", title: "焊机监控", sub: "设备状态、参数漂移与联网诊断", stats: [["在线率", "97.8", "%", "green"], ["焊接中", "28", "台", "cyan"], ["待机设备", "14", "台", "amber"], ["异常设备", "4", "台", "red"]] },
  quality: { eyebrow: "QUALITY INTELLIGENCE · 全量追溯", title: "质量分析", sub: "焊缝缺陷识别与质量趋势研判", stats: [["检测焊缝", "8,942", "道", "cyan"], ["一次合格率", "98.6", "%", "green"], ["返修率", "1.12", "%", "amber"], ["严重缺陷", "3", "项", "red"]] },
  process: { eyebrow: "PROCESS RECIPE · 参数受控", title: "工艺管理", sub: "WPS 工艺库、参数窗口与执行一致性", stats: [["生效工艺", "126", "套", "cyan"], ["执行一致率", "96.8", "%", "green"], ["参数偏移", "7", "次", "amber"], ["待审批", "12", "项", "cyan"]] },
  maintenance: { eyebrow: "PREDICTIVE CARE · 预测维护", title: "设备运维", sub: "健康度评估、保养计划与备件协同", stats: [["设备健康度", "91.4", "%", "green"], ["今日工单", "18", "单", "cyan"], ["即将保养", "6", "台", "amber"], ["停机时长", "42", "分钟", "red"]] },
  energy: { eyebrow: "ENERGY PULSE · 每分钟更新", title: "能耗中心", sub: "电、气、碳一体化能源分析", stats: [["今日用电", "3,842", "kWh", "cyan"], ["单件能耗", "2.98", "kWh", "green"], ["保护气体", "428", "m³", "amber"], ["碳排放", "2.16", "tCO₂e", "cyan"]] },
  safety: { eyebrow: "SAFETY COMMAND · 全域感知", title: "安全预警", sub: "人员、环境与设备风险联合监测", stats: [["安全运行", "186", "小时", "green"], ["在线传感器", "128", "个", "cyan"], ["待处理预警", "5", "项", "amber"], ["高风险事件", "1", "项", "red"]] },
};

function Chart({ kind, variant = 0 }: { kind: ChartKind; variant?: number }) {
  return <ClientOnly fallback={<div className="chart-loading">数据接入中</div>}><Suspense fallback={<div className="chart-loading">数据接入中</div>}><WeldingChart kind={kind} variant={variant} /></Suspense></ClientOnly>;
}

function Glass({ title, kicker, children, className = "" }: { title: string; kicker?: string; children: ReactNode; className?: string }) {
  return <section className={`glass-card ${className}`}><div className="panel-head"><div><span>{kicker ?? "LIVE DATA"}</span><h2>{title}</h2></div><Radio size={15} /></div>{children}</section>;
}

function Stats({ page }: { page: PageKey }) {
  return <div className="stats-grid">{pageData[page].stats.map(([label, value, note, tone], index) => <div className={`stat-card tone-${tone}`} key={label}><div className="stat-index">0{index + 1}</div><p>{label}</p><strong>{value}</strong><small>{note}</small><i /></div>)}</div>;
}

const rows: Record<PageKey, string[][]> = {
  overview: [["车架前梁", "A-01", "386 / 420", "91.9%", "生产中"], ["电池托盘", "B-03", "298 / 310", "96.1%", "生产中"], ["后桥总成", "C-02", "245 / 260", "94.2%", "换型中"], ["座椅骨架", "D-04", "357 / 380", "93.9%", "生产中"]],
  machines: [["WELD-A01", "286A / 24.2V", "18.4 m/min", "84%", "焊接中"], ["WELD-A02", "278A / 23.8V", "17.9 m/min", "91%", "焊接中"], ["WELD-B03", "—", "—", "76%", "待机"], ["WELD-C02", "312A / 25.1V", "19.2 m/min", "62%", "需关注"]],
  quality: [["Q240924-0812", "车架前梁", "咬边", "0.42 mm", "返修中"], ["Q240924-0809", "电池托盘", "气孔", "1.08 mm", "已处置"], ["Q240924-0805", "后桥总成", "未熔合", "3.12 mm", "待复检"], ["Q240924-0798", "座椅骨架", "飞溅", "轻微", "已放行"]],
  process: [["WPS-GMAW-042", "车架前梁", "280A / 24V", "V3.6", "已生效"], ["WPS-MAG-018", "电池托盘", "245A / 22V", "V2.4", "已生效"], ["WPS-CMT-011", "后桥总成", "190A / 19V", "V1.8", "待审批"], ["WPS-GMAW-067", "座椅骨架", "230A / 21V", "V4.1", "试运行"]],
  maintenance: [["WO-240924-18", "A-01 送丝机构", "润滑保养", "李工", "执行中"], ["WO-240924-16", "C-02 焊枪", "喷嘴更换", "王工", "待确认"], ["WO-240924-12", "B-03 机器人", "精度校准", "赵工", "已完成"], ["WO-240924-08", "D-04 水冷机", "流量检查", "陈工", "已完成"]],
  energy: [["焊接机器人", "2,642 kWh", "68.8%", "-3.2%", "正常"], ["烟尘净化", "486 kWh", "12.7%", "+1.6%", "正常"], ["循环水冷", "391 kWh", "10.2%", "-0.8%", "节能"], ["辅助系统", "323 kWh", "8.3%", "+4.1%", "关注"]],
  safety: [["09:42:16", "C区气体浓度", "轻度超限", "处理中", "二级"], ["09:18:04", "A区防护门", "异常开启", "已解除", "三级"], ["08:56:37", "D区烟尘浓度", "趋势升高", "已处置", "三级"], ["08:21:12", "B区人员越界", "进入警戒区", "已确认", "二级"]],
};

function DataTable({ page }: { page: PageKey }) {
  const headers = page === "overview" ? ["产品", "产线", "完成量", "达成率", "状态"] : page === "machines" ? ["设备", "电流 / 电压", "送丝速度", "健康度", "状态"] : page === "quality" ? ["检测编号", "产品", "缺陷类型", "尺寸", "处置"] : page === "process" ? ["工艺编号", "适用产品", "核心参数", "版本", "状态"] : page === "maintenance" ? ["工单", "设备", "任务", "负责人", "状态"] : page === "energy" ? ["用能单元", "能耗", "占比", "同比", "状态"] : ["时间", "监测点", "事件", "进度", "等级"];
  return <div className="table-wrap"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows[page].map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={`${i}-${cell}`}>{i === row.length - 1 ? <span className={`status ${cell.includes("异常") || cell.includes("关注") || cell.includes("二级") ? "warn" : ""}`}><b />{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div>;
}

function Overview({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="dashboard-grid overview-grid"><Glass title="实时产出趋势" kicker="OUTPUT CURVE" className="span-2"><Chart kind="line" /></Glass><Glass title="质量构成" kicker="QUALITY MIX"><Chart kind="pie" /></Glass><Glass title="产线达成率" kicker="LINE PERFORMANCE"><Chart kind="bar" /></Glass><Glass title="生产任务明细" kicker="PRODUCTION QUEUE" className="span-2"><DataTable page={page} /></Glass></div></>;
}

function Machines({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="machine-layout"><div className="machine-stack">{["A-01", "A-02", "B-03", "C-02", "D-01", "D-04"].map((id, i) => <div className="machine-node" key={id}><Bot /><div><b>{id} 智能焊机</b><span>{i === 3 ? "参数漂移" : i === 2 ? "设备待机" : "稳定焊接"}</span></div><em className={i === 3 ? "danger" : i === 2 ? "idle" : ""}>{i === 3 ? "异常" : i === 2 ? "待机" : "在线"}</em></div>)}</div><Glass title="焊接参数实时波形" className="machine-chart"><Chart kind="line" variant={1} /></Glass><Glass title="设备运行占比" className="machine-pie"><Chart kind="pie" variant={1} /></Glass><Glass title="设备明细" className="machine-table"><DataTable page={page} /></Glass></div></>;
}

function Quality({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="quality-grid"><Glass title="质量能力雷达" className="quality-radar"><Chart kind="radar" /></Glass><Glass title="缺陷趋势" className="quality-line"><Chart kind="line" /></Glass><Glass title="缺陷分布"><Chart kind="pie" /></Glass><Glass title="产品合格率"><Chart kind="bar" /></Glass><Glass title="最新缺陷追溯" className="span-2"><DataTable page={page} /></Glass></div></>;
}

function Process({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="process-strip"><div><span>当前配方</span><strong>WPS-GMAW-042</strong></div>{[["电流", "280 A"], ["电压", "24.0 V"], ["焊速", "8.4 mm/s"], ["气体", "18 L/min"]].map(([k,v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><div className="process-grid"><Glass title="参数窗口监测" className="span-2"><Chart kind="line" variant={1} /></Glass><Glass title="工艺能力"><Chart kind="radar" /></Glass><Glass title="工艺版本库" className="span-3"><DataTable page={page} /></Glass></div></>;
}

function Maintenance({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="maintenance-layout"><Glass title="设备健康排名"><Chart kind="bar" /></Glass><div className="timeline">{[["10:30", "A-01 送丝机构保养", "执行中"], ["11:20", "C-02 焊枪更换喷嘴", "待确认"], ["14:00", "D-04 水冷系统巡检", "已计划"], ["16:30", "B-03 机器人校准", "已排程"]].map(([t,n,s],i) => <div className="timeline-item" key={t}><time>{t}</time><i className={i === 0 ? "active" : ""} /><div><b>{n}</b><span>{s}</span></div></div>)}</div><Glass title="近七日故障趋势"><Chart kind="line" /></Glass><Glass title="维护工单" className="span-2"><DataTable page={page} /></Glass></div></>;
}

function Energy({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="energy-flow"><div className="energy-source"><Zap /><strong>3,842</strong><span>kWh 今日总输入</span></div><ChevronRight /><div className="energy-branches">{[["焊接", "68.8%"], ["净化", "12.7%"], ["水冷", "10.2%"], ["辅助", "8.3%"]].map(([n,v]) => <div key={n}><i /><span>{n}</span><b>{v}</b></div>)}</div></div><div className="energy-grid"><Glass title="分时能耗曲线" className="span-2"><Chart kind="line" /></Glass><Glass title="能源构成"><Chart kind="pie" variant={1} /></Glass><Glass title="用能单元分析" className="span-3"><DataTable page={page} /></Glass></div></>;
}

function Safety({ page }: { page: PageKey }) {
  return <><Stats page={page} /><div className="safety-banner"><div className="risk-ring"><span>综合风险指数</span><strong>18</strong><small>低风险</small></div><div className="safety-zones">{["A区 · 正常", "B区 · 正常", "C区 · 气体预警", "D区 · 正常"].map((z,i) => <div className={i === 2 ? "alert" : ""} key={z}><ShieldCheck /><span>{z}</span></div>)}</div></div><div className="safety-grid"><Glass title="风险因子雷达"><Chart kind="radar" /></Glass><Glass title="安全事件趋势"><Chart kind="bar" /></Glass><Glass title="实时预警流" className="span-2"><DataTable page={page} /></Glass></div></>;
}

export function WeldingPlatform({ page }: { page: PageKey }) {
  const data = pageData[page];
  return <div className={`platform page-${page}`} style={{ "--factory-bg": `url(${factoryBackground})` } as CSSProperties}>
    <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Factory /></span><div><b>弧光智造</b><small>ARCWELD DIGITAL FACTORY</small></div></Link><nav>{nav.map(({ to, label, icon: Icon }) => <Link key={to} to={to} activeProps={{ className: "nav-active" }} activeOptions={{ exact: to === "/" }}><Icon /><span>{label}</span></Link>)}</nav><div className="system-live"><i />系统在线</div></header>
    <main><div className="page-heading"><div><p>{data.eyebrow}</p><h1>{data.title}</h1><span>{data.sub}</span></div><div className="shift-chip"><Activity /><span>当前班次</span><strong>早班 A</strong></div></div>
      {page === "overview" && <Overview page={page} />}{page === "machines" && <Machines page={page} />}{page === "quality" && <Quality page={page} />}{page === "process" && <Process page={page} />}{page === "maintenance" && <Maintenance page={page} />}{page === "energy" && <Energy page={page} />}{page === "safety" && <Safety page={page} />}
    </main><footer><span>ARCWELD OS / 生产数据每 30 秒同步</span><span><Sparkles /> AI 工艺引擎已连接</span></footer>
  </div>;
}
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as CalendarTooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <h3 className="text-sm font-medium mb-4 text-slate-700">{title}</h3>
    {children}
  </div>
);

const BarCard = ({ barData }) => (
  <Card title={<span className="text-lg font-normal text-slate-800">
      Notes Overview
    </span>}>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

const PieCard = ({ pieData }) => (
  <Card title={<span className="text-lg font-normal text-slate-800">
      Notes Overview
    </span>}>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={90}
          label
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const LineCard = ({ lineData }) => (
  <Card title={<span className="text-lg font-normal text-slate-800">
      Notes Over Time
    </span>}>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={lineData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#16a34a"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const CalendarCard = ({ calendarData }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  return (
    <Card title={<span className="text-lg font-normal text-slate-800">
      Notes Activity Calendar
    </span>}>
      <div className="flex gap-2 text-xs text-slate-500 ml-10 mb-2">
        <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={calendarData}
        showWeekdayLabels
        weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        gutterSize={3}
        classForValue={(v) => {
          if (!v) return "color-empty";
          if (v.count >= 5) return "color-github-4";
          if (v.count >= 3) return "color-github-3";
          if (v.count >= 2) return "color-github-2";
          return "color-github-1";
        }}
        tooltipDataAttrs={(v) => ({
          "data-tooltip-id": "heatmap-tip",
          "data-tooltip-content": v
            ? `${v.count} notes on ${v.date}`
            : "No notes",
        })}
      />
      </div>
      <CalendarTooltip id="heatmap-tip" />
    </Card>
  );
};

export default {
  Bar: BarCard,
  Pie: PieCard,
  Line: LineCard,
  Calendar: CalendarCard,
};

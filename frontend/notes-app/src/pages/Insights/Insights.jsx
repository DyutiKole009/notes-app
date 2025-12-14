import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InsightsCharts from "./InsightsCharts";

const Insights = () => {
  const { notes } = useOutletContext();

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    if (!notes || notes.length === 0) return;

    setBarData([
      { name: "Total Notes", value: notes.length },
      { name: "Pinned", value: notes.filter(n => n.isPinned).length },
    ]);

    const tagMap = {};
    notes.forEach(n =>
      n.tags.forEach(t => (tagMap[t] = (tagMap[t] || 0) + 1))
    );

    setPieData(
      Object.keys(tagMap).map(tag => ({
        name: tag,
        value: tagMap[tag],
      }))
    );

    const dateMap = {};
    notes.forEach(n => {
      const d = new Date(n.createdOn).toISOString().slice(0, 10);
      dateMap[d] = (dateMap[d] || 0) + 1;
    });

    setLineData(
      Object.keys(dateMap)
        .sort()
        .map(d => ({ date: d, count: dateMap[d] }))
    );

    setCalendarData(
      Object.keys(dateMap).map(d => ({
        date: d,
        count: dateMap[d],
      }))
    );
  }, [notes]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Insights</h1>
        <p className="text-sm text-slate-500">
          Visual overview of your notes activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightsCharts.Bar barData={barData} />
        <InsightsCharts.Pie pieData={pieData} />
      </div>

      <div className="mt-8">
        <InsightsCharts.Line lineData={lineData} />
      </div>

      <div className="mt-10">
        <InsightsCharts.Calendar calendarData={calendarData} />
      </div>
    </div>
  );
};

export default Insights;

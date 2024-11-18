import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const CountriesComponent = ({ demandByCountry }) => {
  // Перетворення даних у потрібний формат для Recharts
  const data = Object.entries(demandByCountry).map(([country, percentage]) => ({
    name: country,
    value: percentage,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF"];

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Sales by Country</h2>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CountriesComponent;

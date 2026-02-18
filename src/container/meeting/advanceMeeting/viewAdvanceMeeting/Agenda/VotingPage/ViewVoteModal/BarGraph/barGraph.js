import { memo } from "react";
import { Bar, BarChart, Cell, XAxis } from "recharts";

const BarGraph = memo(({ data }) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "600px",
        maxHeight: "30vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}>
      <XAxis dataKey='answer' fontWeight={600} fontSize={14} />

      <Bar dataKey='percentage'>
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            cursor='pointer'
            style={{
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
            fill={entry.color}
          />
        ))}
      </Bar>
    </BarChart>
  );
});

export default BarGraph;

import { memo } from "react";
import { PieChart, Pie, Legend } from "recharts";

const style = {
  top: "50%",
  right: 100,
  transform: "translate(0, -50%)",
  lineHeight: "28px",
  fontSize: 14,
  fontWeight: 600,
};
const PieGraph = memo(({ data }) => {
  return (
      <PieChart
        responsive
        style={{
          width: "100%",
          aspectRatio: 1,
        }}>
        <Pie
          data={data}
          dataKey='value'
          nameKey='name'
          outerRadius='80%'
          innerRadius='60%'
          isAnimationActive={true}
        />
        <Legend
          layout='vertical'
          verticalAlign='middle'
          iconType='circle'
          wrapperStyle={style}
        />
      </PieChart>
  );
});

export default PieGraph;

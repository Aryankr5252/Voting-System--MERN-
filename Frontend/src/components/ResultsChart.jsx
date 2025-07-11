import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const ResultsChart = ({ data }) => {
  console.log("Chart Data: ", data);

  const chartData = data.map((c) => ({
    name: c.name,
    votes: c.voteCount,
  }));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Live Vote Chart</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="votes"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ResultsChart;

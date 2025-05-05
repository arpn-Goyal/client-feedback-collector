import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4f46e5", "#f59e0b", "#ef4444", "#10b981", "#6366f1"];

const BreakdownChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-gray-500 dark:text-gray-300">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Feedback Breakdown
        </h2>
        <p>No data available.</p>
      </div>
    );
  }

  const breakdownArray = [
    { type: "Bugs", value: data.bugs || 0 },
    { type: "Suggestions", value: data.suggestions || 0 },
    { type: "Complaints", value: data.complaints || 0 },
    { type: "Praise", value: data.praise || 0 },
    { type: "Version Feedback", value: data.versionFeedback || 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Feedback Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={breakdownArray}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {breakdownArray.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BreakdownChart;

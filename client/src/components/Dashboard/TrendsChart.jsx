import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TrendsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-gray-500 dark:text-gray-300">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Feedback Trend</h2>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Feedback Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name="Feedback Count" />
          <Line type="monotone" dataKey="happy" stroke="#355E3B" strokeWidth={2} name="Happy Reactions" />
          <Line type="monotone" dataKey="meh" stroke="#f59e0b" strokeWidth={2} name="Meh Reactions" />
          <Line type="monotone" dataKey="sad" stroke="#FF0000" strokeWidth={2} name="Sad Reactions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;

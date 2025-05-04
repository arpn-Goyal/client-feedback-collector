// AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCards from "../components/Dashboard/SummaryCards";
import TrendsChart from "../components/Dashboard/TrendsChart";
import BreakdownChart from "../components/Dashboard/BreakdownChart";
import KeywordTopics from "../components/Dashboard/KeywordTopics";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [topics, setTopics] = useState([]);
  const [titleDescTopics, setTitleDescTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendsRes, breakdownRes, topicsRes] =
          await Promise.all([
            axios.get("http://localhost:4000/api/dashboard/summary"),
            axios.get("http://localhost:4000/api/dashboard/trends"),
            axios.get("http://localhost:4000/api/dashboard/breakdown"),
            axios.get("http://localhost:4000/api/dashboard/topics"),
          ]);

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setBreakdown(breakdownRes.data.breakdown);
        setTopics(topicsRes.data.trendingTopics);
        setTitleDescTopics(topicsRes.data.businessTopics);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  function mergeVolumeAndReactions(volume, reactions) {
    const map = {};

    volume.forEach((item) => {
      map[item.date] = { date: item.date, count: item.count };
    });

    reactions.forEach((item) => {
      if (!map[item.date]) {
        map[item.date] = { date: item.date };
      }
      map[item.date].happy = item.happy;
      map[item.date].sad = item.sad;
      map[item.date].meh = item.meh;
    });

    return Object.values(map);
  }
  const mergedData = mergeVolumeAndReactions(trends.volume, trends.reactions);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      <SummaryCards summary={summary} />
      <TrendsChart data={mergedData} />
      <BreakdownChart data={breakdown} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeywordTopics topics={topics} title="Top Feedback Keywords" />
        <KeywordTopics
          topics={titleDescTopics}
          title="Top Title/Description Keywords"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

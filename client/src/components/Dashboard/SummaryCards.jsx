import { Card, CardContent } from "../ui/card";
import CountUp from "react-countup";

const CardItem = ({ title, value }) => (
  <Card className="w-full p-4 bg-white dark:bg-gray-900 shadow-md">
    <CardContent>
      <h4 className="text-sm text-gray-500 dark:text-gray-300">{title}</h4>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        <CountUp end={value} duration={1.5} separator="," />
      </p>
    </CardContent>
  </Card>
);

const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <CardItem title="Total Feedbacks" value={summary.totalFeedbacks || 0} />
      <CardItem title="This Week" value={summary.weeklyFeedbacks || 0} />
      <CardItem title="This Month" value={summary.monthlyFeedbacks || 0} />
      <CardItem title="Avg Sentiment Score" value={summary.averageRating || 0} />
    </div>
  );
};

export default SummaryCards;
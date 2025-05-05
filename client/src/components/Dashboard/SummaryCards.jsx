import { Card, CardContent } from "../ui/card";
import CountUp from "react-countup";
// import { cn } from "@/lib/utils"; // optional if you're using classnames or Tailwind helpers

const CardItem = ({ title, value, extra, decimals = 0 }) => (
  <Card className="w-full p-4 bg-white dark:bg-gray-900 shadow-md">
    <CardContent>
      <h4 className="text-sm text-gray-500 dark:text-gray-300">{title}</h4>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        <CountUp end={value} duration={1.5} separator="," decimals={decimals} />
      </p>
      {extra && <div className="mt-2">{extra}</div>}
    </CardContent>
  </Card>
);

const getSentimentColor = (label) => {
  switch (label) {
    case "Positive":
      return "bg-green-100 text-green-800";
    case "Negative":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const SummaryCards = ({ summary }) => {
  const sentimentLabel = summary.sentimentLabel || "Neutral";
  const sentimentColor = getSentimentColor(sentimentLabel);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <CardItem title="Total Feedbacks" value={summary.totalFeedbacks || 0} />
      <CardItem title="This Week" value={summary.weeklyFeedbacks || 0} />
      <CardItem title="This Month" value={summary.monthlyFeedbacks || 0} />
      <CardItem
        title="Avg Sentiment Score"
        value={summary.averageSentiment || 0}
        decimals={2}
        extra={
          <span
            title="Based on emoji reactions"
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${ sentimentLabel === "Positive" ? averageSentiment >= 0.8 ? "bg-green-600 text-white" : "bg-green-100 text-green-800" : sentimentLabel === "Negative" ? averageSentiment <= -0.8 ? "bg-red-600 text-white" : "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800" }`}>
            <span> {sentimentLabel === "Positive" ? "😊" : sentimentLabel === "Negative" ? "😔" : "😐"} </span> <span>{sentimentLabel}</span> </span>
        }
      />
    </div>
  );
};

export default SummaryCards;

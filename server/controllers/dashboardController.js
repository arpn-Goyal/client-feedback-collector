// controllers/dashboardController.js
import FeedbackMongodb from '../model/Feedback.mongodb.js';


export const getDashboardSummary = async (req, res) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);


        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


        const summary = await FeedbackMongodb.aggregate([
            {
                $facet: {
                    total: [
                        { $count: "count" }
                    ],
                    weekly: [
                        { $match: { createdAt: { $gte: startOfWeek } } },
                        { $count: "count" }
                    ],
                    monthly: [
                        { $match: { createdAt: { $gte: startOfMonth } } },
                        { $count: "count" }
                    ],
                    reactions: [
                        { $match: { reaction: { $in: ["happy", "sad", "meh"] } } }, // 👈 this is key
                        {
                            $group: {
                                _id: "$reaction",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);



        const totalFeedbacks = summary[0].total[0]?.count || 0;
        const weeklyFeedbacks = summary[0].weekly[0]?.count || 0;
        const monthlyFeedbacks = summary[0].monthly[0]?.count || 0;


        const reactions = summary[0].reactions.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});


        const totalReactions = Object.values(reactions).reduce((sum, val) => sum + val, 0) || 1;


        res.json({
            totalFeedbacks,
            weeklyFeedbacks,
            monthlyFeedbacks,
            averageRating: null, // if you add a rating field later
            reactionStats: {
                happy: reactions["happy"] || 0,
                sad: reactions["sad"] || 0,
                meh: reactions["meh"] || 0,
                happyRatio: (reactions["happy"] || 0) / totalReactions,
                sadRatio: (reactions["sad"] || 0) / totalReactions,
                mehRatio: (reactions["meh"] || 0) / totalReactions
            }
        });


    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

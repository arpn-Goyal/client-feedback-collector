// controllers/dashboardController.js
import FeedbackMongodb from '../model/Feedback.mongodb.js';

// Summary
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



// Trends
export const getDashboardTrends = async (req, res) => {
    try {
        const range = req.query.range || '7d';
        const days = range === '30d' ? 30 : 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Volume trend (count per day)
        const volumeData = await FeedbackMongodb.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Reaction trend (count per day per reaction type)
        const reactionData = await FeedbackMongodb.aggregate([
            { $match: { createdAt: { $gte: startDate }, reaction: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        reaction: "$reaction"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    reactions: {
                        $push: {
                            k: "$_id.reaction",
                            v: "$count"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    reactions: {
                        $filter: {
                            input: "$reactions",
                            as: "item",
                            cond: { $ne: ["$$item.k", null] } // Filter out null keys
                        }
                    }
                }
            },
            {
                $addFields: {
                    reactions: { $arrayToObject: "$reactions" }
                }
            },
            { $sort: { date: 1 } }
        ]);


        res.json({
            volume: volumeData.map(item => ({
                date: item._id,
                count: item.count
            })),
            reactions: reactionData.map(item => ({
                date: item.date,
                happy: item.reactions.happy || 0,
                sad: item.reactions.sad || 0,
                meh: item.reactions.meh || 0
            }))
        });

    } catch (err) {
        console.error("Error in trends API:", err);
        res.status(500).json({ message: "Failed to load trends" });
    }
};

// BreakDown
export const getDashboardBreakdown = async (req, res) => {
    try {
      const breakdown = await FeedbackMongodb.aggregate([
        {
          $group: {
            _id: null,
            bugs: {
              $sum: {
                $cond: [{ $ne: ["$feedback.bugsIssues", ""] }, 1, 0]
              }
            },
            suggestions: {
              $sum: {
                $cond: [{ $ne: ["$feedback.featureRequests", ""] }, 1, 0]
              }
            },
            complaints: {
              $sum: {
                $cond: [{ $ne: ["$feedback.complaints", ""] }, 1, 0]
              }
            },
            praise: {
              $sum: {
                $cond: [{ $ne: ["$feedback.positiveFeedback", ""] }, 1, 0]
              }
            },
            versionFeedback: {
              $sum: {
                $cond: [{ $ne: ["$feedback.versionFeedback", ""] }, 1, 0]
              }
            }
          }
        }
      ]);
  
      res.json(breakdown[0]);
    } catch (err) {
      console.error("Error in breakdown API:", err);
      res.status(500).json({ message: "Failed to load breakdown" });
    }
  };
  


// Topics
// export const getDashboardTopics = async (req, res) => {
//     try {
//       // Fetch all text fields
//       const feedbacks = await FeedbackMongodb.find({}, {
//         'feedback.bugsIssues': 1,
//         'feedback.featureRequests': 1,
//         'feedback.complaints': 1,
//         'feedback.positiveFeedback': 1,
//         'feedback.versionFeedback': 1
//       });
  
//       const wordCount = {};
  
//       feedbacks.forEach(entry => {
//         const fields = Object.values(entry.feedback || {});
//         fields.forEach(text => {
//           if (!text) return;
//           const words = text
//             .toLowerCase()
//             .replace(/[^\w\s]/gi, '')  // Remove punctuation
//             .split(/\s+/);             // Split by space
  
//           words.forEach(word => {
//             if (word.length < 3) return; // Skip short/common words
//             wordCount[word] = (wordCount[word] || 0) + 1;
//           });
//         });
//       });
  
//       // Convert to sorted array
//       const topWords = Object.entries(wordCount)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 10)
//         .map(([word, count]) => ({ word, count }));
  
//       res.json({ topics: topWords });
//     } catch (err) {
//       console.error("Error in topics API:", err);
//       res.status(500).json({ message: "Failed to load topics" });
//     }
//   };
  

// Title-Desc-Topics
// export const getTitleDescriptionTopics = async (req, res) => {
//     try {
//       const allowedKeywords = new Set([
//         "design", "product", "functionality", "bug", "issue", "business", "good",
//         "performance", "feedback", "experience", "feature", "login", "dark", "crash",
//         "responsive", "mobile", "slow", "fast", "ui", "ux", "navigation", "error",
//         "stable", "popup", "layout", "dashboard", "form", "data"
//       ]);
  
//       const feedbacks = await FeedbackMongodb.find({}, {
//         title: 1,
//         description: 1
//       });
  
//       const keywordCount = {};
  
//       feedbacks.forEach(entry => {
//         const text = `${entry.title} ${entry.description}`.toLowerCase();
//         const words = text
//           .replace(/[^\w\s]/gi, '') // remove punctuation
//           .split(/\s+/);
  
//         words.forEach(word => {
//           if (allowedKeywords.has(word)) {
//             keywordCount[word] = (keywordCount[word] || 0) + 1;
//           }
//         });
//       });
  
//       const result = Object.entries(keywordCount)
//         .sort((a, b) => b[1] - a[1])
//         .map(([word, count]) => ({ word, count }));
  
//       res.json({ titleDescTopics: result });
//     } catch (err) {
//       console.error("Error in title/desc topic API:", err);
//       res.status(500).json({ message: "Failed to load title/desc topics" });
//     }
//   };
  


export const getDashboardTopics = async (req, res) => {
  try {
    // 1. Business-relevant keywords (controlled vocab)
    const allowedKeywords = new Set([
      "design", "product", "functionality", "bug", "issue", "business", "good",
      "performance", "feedback", "experience", "feature", "login", "dark", "crash",
      "responsive", "mobile", "slow", "fast", "ui", "ux", "navigation", "error",
      "stable", "popup", "layout", "dashboard", "form", "data"
    ]);

    const stopWords = new Set([
      "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into",
      "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their",
      "then", "there", "these", "they", "this", "to", "was", "will", "with"
    ]);

    const feedbacks = await FeedbackMongodb.find({}, {
      title: 1,
      description: 1,
      feedback: 1
    });

    const businessKeywordCount = {};
    const trendingKeywordCount = {};

    feedbacks.forEach(entry => {
      // -- Title + Description (Controlled keywords only)
      const combinedText = `${entry.title} ${entry.description}`.toLowerCase();
      const businessWords = combinedText.replace(/[^\w\s]/gi, '').split(/\s+/);
      businessWords.forEach(word => {
        if (allowedKeywords.has(word)) {
          businessKeywordCount[word] = (businessKeywordCount[word] || 0) + 1;
        }
      });

      // -- Feedback Fields (All dynamic keywords except stopwords)
      const feedbackText = Object.values(entry.feedback || {}).join(" ").toLowerCase();
      const feedbackWords = feedbackText.replace(/[^\w\s]/gi, '').split(/\s+/);
      feedbackWords.forEach(word => {
        if (word.length >= 3 && !stopWords.has(word)) {
          trendingKeywordCount[word] = (trendingKeywordCount[word] || 0) + 1;
        }
      });
    });

    const topBusiness = Object.entries(businessKeywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const topTrending = Object.entries(trendingKeywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    res.json({
      businessTopics: topBusiness,  
      trendingTopics: topTrending
    });
  } catch (err) {
    console.error("Error in merged topics API:", err);
    res.status(500).json({ message: "Failed to load merged topics" });
  }
};

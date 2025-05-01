import FeedbackMongodb from '../model/Feedback.mongodb.js';


export const submitFeedback = async (req, res) => {
  try {
    //console.log("Incoming body:", req.body);
   // console.log("Incoming files:", req.files);

    const {
      title,
      description,
      projectVersion,
      expiryDate,
      reaction,
      token,
      userAgent,
      feedback,
    } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: 'Missing feedback data' });
    }

    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(feedback);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid feedback format' });
    }

    const filePaths = req.files?.map((file) => file.path.replace(/\\/g, '/')) || [];

    const newFeedback = new FeedbackMongodb({
      title,
      description,
      projectVersion,
      expiryDate,
      reaction,
      token,
      userAgent,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      files: filePaths,
      feedback: parsedFeedback,
    });

    await newFeedback.save();

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('[Feedback Submit Error]:', err);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};



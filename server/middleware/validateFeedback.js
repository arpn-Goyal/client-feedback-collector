export const validateFeedback = (req, res, next) => {
  
    const { title, description, projectVersion, expiryDate, token, feedback } = req.body;
 

    if (!title || !description || !projectVersion || !expiryDate || !token || !feedback) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
  
    try {
      JSON.parse(feedback); // Ensure feedback is valid JSON
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid feedback format.' });
    }
  
    next();
  };
  
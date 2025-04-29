import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import useSubmitFeedback from '../../hooks/useSubmitFeedback.js';

export default function ClientFeedbackForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [reaction, setReaction] = useState('');
  const [feedback, setFeedback] = useState({ featureRequests: '', bugsIssues: '', positiveFeedback: '', complaints: '', versionFeedback: '' });
  const [showEmojiPicker, setShowEmojiPicker] = useState({ featureRequests: false, bugsIssues: false, positiveFeedback: false, complaints: false, versionFeedback: false });
  const [projectVersion, setProjectVersion] = useState('');
  const { submitFeedback, loading, error, success } = useSubmitFeedback();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleReactionClick = (type) => {
    setReaction(type);
  };

  const handleEmojiClick = (category, emoji) => {
    setFeedback(prev => ({ ...prev, [category]: prev[category] + emoji.emoji }));
  };

  const handleVersionChange = (e) => {
    const selectedVersion = e.target.value;
    setProjectVersion(selectedVersion);

    const today = new Date();
    if (selectedVersion === 'v1.0') {
      today.setDate(today.getDate() + 7);
    } else if (selectedVersion === 'v2.0') {
      today.setDate(today.getDate() + 14);
    } else {
      today.setDate(today.getDate() + 30);
    }
    setExpiryDate(today.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, description, projectVersion, expiryDate, files, reaction, feedback });
    // In handleSubmit:
      await submitFeedback({ title, description, projectVersion, expiryDate, files, reaction, feedback });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <h1 className="text-3xl font-bold mb-6">Client Feedback Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title..." className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." className="w-full p-2 border rounded"></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Project Version</label>
            <select value={projectVersion} onChange={handleVersionChange} className="w-full p-2 border rounded">
              <option value="">Select Version</option>
              <option value="v1.0">v1.0</option>
              <option value="v2.0">v2.0</option>
              <option value="v3.0">v3.0</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Feedback Deadline</label>
            <input type="date" value={expiryDate} disabled className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Upload Files 📎 Attachments</label>
            <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
            <div className="flex gap-4 mt-4 flex-wrap">
              {previewUrls.map((url, idx) => (
                <img key={idx} src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Sentiment Reactions 📊</label>
            <div className="flex gap-6 mt-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick('happy')}
                className={`p-2 rounded-full ${reaction === 'happy' ? 'bg-green-200' : 'hover:bg-gray-100'}`}
              >
                <Smile className="h-8 w-8 text-green-500" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick('meh')}
                className={`p-2 rounded-full ${reaction === 'meh' ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}
              >
                <Meh className="h-8 w-8 text-yellow-500" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick('sad')}
                className={`p-2 rounded-full ${reaction === 'sad' ? 'bg-red-200' : 'hover:bg-gray-100'}`}
              >
                <Frown className="h-8 w-8 text-red-500" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Feedback Categories</h2>

            {['featureRequests', 'bugsIssues', 'positiveFeedback', 'complaints', 'versionFeedback'].map((category, idx) => (
              <div key={idx}>
                <label className="block mb-1">
                  {category === 'featureRequests' && '🔧 Feature Requests'}
                  {category === 'bugsIssues' && '🐞 Bugs & Issues'}
                  {category === 'positiveFeedback' && '❤️ Positive Feedback'}
                  {category === 'complaints' && '😡 Complaints'}
                  {category === 'versionFeedback' && '🔄 Version Feedback'}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={feedback[category]}
                    onChange={(e) => setFeedback({ ...feedback, [category]: e.target.value })}
                    placeholder="Write here..."
                    className="w-full p-2 border rounded"
                  />
                  <button type="button" className="p-2 border rounded" onClick={() => setShowEmojiPicker(prev => ({ ...prev, [category]: !prev[category] }))}>
                    😀
                  </button>
                </div>
                {showEmojiPicker[category] && (
                  <div className="mt-2">
                    <EmojiPicker onEmojiClick={(emoji) => handleEmojiClick(category, emoji)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="w-full mt-6 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}
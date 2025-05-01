import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import useSecureFeedbackSubmit from "../../hooks/useSecureFeedbackSubmit.js";

export default function ClientFeedbackForm() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [title, setTitle] = useState("Main Demo"); // Default title
  const [description, setDescription] = useState(
    "This is a sample description for demo purposes."
  ); // Default description
  const [projectVersion, setProjectVersion] = useState("v1.0"); // Default version
  const [expiryDate, setExpiryDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Default deadline based on v1.0
    return today.toISOString().split("T")[0];
  });
  const [reaction, setReaction] = useState("happy"); // Default sentiment

  const [feedback, setFeedback] = useState({
    featureRequests: "Add dark mode 🌙",
    bugsIssues: "Login button not working on mobile 🚫",
    positiveFeedback: "Great UI and smooth experience! 👏",
    complaints: "Too many popups 😡",
    versionFeedback: "v1.0 is stable but missing some features 🔧",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { submitFeedback, loading, error, success } = useSecureFeedbackSubmit();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");
    if (jwtToken) {
      setToken(jwtToken);
      const hash = btoa(jwtToken); // base64 hash
      const stored = localStorage.getItem(`submitted_${hash}`);
      if (stored) setIsSubmitted(true);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    console.log(`SelectedFiles:  ${selectedFiles}`)
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
    console.log(`Previews:  ${previews}`)
  };

  const handleReactionClick = (type) => {
    setReaction(type);
  };

  const handleEmojiClick = (category, emoji) => {
    setFeedback((prev) => ({
      ...prev,
      [category]: prev[category] + emoji.emoji,
    }));
  };

  const handleVersionChange = (e) => {
    const selectedVersion = e.target.value;
    setProjectVersion(selectedVersion);
    const today = new Date();
    if (selectedVersion === "v1.0") today.setDate(today.getDate() + 7);
    else if (selectedVersion === "v2.0") today.setDate(today.getDate() + 14);
    else today.setDate(today.getDate() + 30);
    setExpiryDate(today.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) return; // 🕳️ Honeypot triggered

    const hash = btoa(token); 

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("projectVersion", projectVersion);
    formData.append("expiryDate", expiryDate);
    formData.append("reaction", reaction);
    formData.append("token", token);
    formData.append("userAgent", navigator.userAgent);
    formData.append("ip", ""); // backend should determine real IP

    files.forEach((file) => {
      formData.append("files", file);
    });

    // ✅ Correctly append entire feedback object as a string
    formData.append("feedback", JSON.stringify(feedback));

    const res = await submitFeedback(formData);
    if (res && res.success) {
      localStorage.setItem(`submitted_${hash}`, "true");
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-20 text-green-600 text-xl font-semibold">
        ✅ You’ve already submitted feedback. Thank you!
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <h1 className="text-3xl font-bold mb-6">Client Feedback Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden) */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            autoComplete="off"
            name="nickname"
          />

          {/* ... [REMAINS UNCHANGED: Title, Description, Version, etc.] */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Project Version
            </label>
            <select
              value={projectVersion}
              onChange={handleVersionChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Version</option>
              <option value="v1.0">v1.0</option>
              <option value="v2.0">v2.0</option>
              <option value="v3.0">v3.0</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Feedback Deadline
            </label>
            <input
              type="date"
              value={expiryDate}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Upload Files 📎 Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-4 mt-4 flex-wrap">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Sentiment Reactions 📊
            </label>
            <div className="flex gap-6 mt-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick("happy")}
                className={`p-2 rounded-full ${
                  reaction === "happy" ? "bg-green-200" : "hover:bg-gray-100"
                }`}
              >
                <Smile className="h-8 w-8 text-green-500" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick("meh")}
                className={`p-2 rounded-full ${
                  reaction === "meh" ? "bg-yellow-200" : "hover:bg-gray-100"
                }`}
              >
                <Meh className="h-8 w-8 text-yellow-500" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => handleReactionClick("sad")}
                className={`p-2 rounded-full ${
                  reaction === "sad" ? "bg-red-200" : "hover:bg-gray-100"
                }`}
              >
                <Frown className="h-8 w-8 text-red-500" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Feedback Categories</h2>

            {[
              "featureRequests",
              "bugsIssues",
              "positiveFeedback",
              "complaints",
              "versionFeedback",
            ].map((category, idx) => (
              <div key={idx}>
                <label className="block mb-1">
                  {category === "featureRequests" && "🔧 Feature Requests"}
                  {category === "bugsIssues" && "🐞 Bugs & Issues"}
                  {category === "positiveFeedback" && "❤️ Positive Feedback"}
                  {category === "complaints" && "😡 Complaints"}
                  {category === "versionFeedback" && "🔄 Version Feedback"}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={feedback[category]}
                    onChange={(e) =>
                      setFeedback({ ...feedback, [category]: e.target.value })
                    }
                    placeholder="Write here..."
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    className="p-2 border rounded"
                    onClick={() =>
                      setShowEmojiPicker((prev) => ({
                        ...prev,
                        [category]: !prev[category],
                      }))
                    }
                  >
                    😀
                  </button>
                </div>
                {showEmojiPicker[category] && (
                  <div className="mt-2">
                    <EmojiPicker
                      onEmojiClick={(emoji) =>
                        handleEmojiClick(category, emoji)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-600 mt-2">
              Feedback submitted successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

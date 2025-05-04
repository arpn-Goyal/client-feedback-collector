const KeywordTopics = ({ topics, title }) => {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{title}</h2>
        <ul className="space-y-1">
          {topics.map((topic, index) => (
            <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-200">
              <span>{topic.word}</span>
              <span className="font-medium">{topic.count}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default KeywordTopics;
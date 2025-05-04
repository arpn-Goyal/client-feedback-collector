export const Card = ({ className = "", children }) => {
  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

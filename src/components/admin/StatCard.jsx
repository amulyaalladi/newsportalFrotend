const StatCard = ({
  title,
  value,
  icon,
  description,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-2 h-8 w-24 bg-gray-200 animate-pulse rounded" />
          ) : (
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {value ?? 0}
            </h2>
          )}

          {description && (
            <p className="mt-2 text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
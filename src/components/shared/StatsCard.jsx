import { cn } from "@/utils/helpers";

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  yellow: "bg-yellow-50 text-yellow-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              colorMap[color],
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

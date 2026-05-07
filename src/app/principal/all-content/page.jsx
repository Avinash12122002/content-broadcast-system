"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge, ScheduleBadge } from "@/components/shared/StatusBadge";
import { FilePreview } from "@/components/shared/FilePreview";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { contentService } from "@/services/content.service";
import { formatDate } from "@/utils/helpers";
import { Search, Filter } from "lucide-react";

const STATUSES = ["all", "pending", "approved", "rejected"];

export default function AllContentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: allContents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allContent"],
    queryFn: () => contentService.getAllContent(),
  });

  const filtered = useMemo(() => {
    return allContents.filter((c) => {
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [allContents, search, statusFilter]);

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Content</h1>
          <p className="text-gray-500 text-sm">
            {allContents.length} total items across all teachers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, subject, or teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 capitalize"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s === "all" ? "All Statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Preview",
                    "Title",
                    "Teacher",
                    "Subject",
                    "Schedule",
                    "Status",
                    "Uploaded",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {error ? (
                  <tr>
                    <td colSpan={7}>
                      <ErrorState message={error.message} onRetry={refetch} />
                    </td>
                  </tr>
                ) : isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={7} />
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon="search"
                        title="No results found"
                        description="Try adjusting your filters or search query."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <FilePreview
                          src={item.fileUrl}
                          alt={item.title}
                          className="h-12 w-16 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-xs truncate">
                          {item.title}
                        </p>
                        {item.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5 max-w-xs truncate">
                            ↳ {item.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {item.teacherName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                          {item.subject}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ScheduleBadge
                          startTime={item.startTime}
                          endTime={item.endTime}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {allContents.length} items
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge, ScheduleBadge } from "@/components/shared/StatusBadge";
import { FilePreview } from "@/components/shared/FilePreview";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ContentCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/content.service";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/helpers";
import { CONTENT_STATUS } from "@/utils/constants";
import { Upload, AlertCircle } from "lucide-react";
import Link from "next/link";

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function MyContentPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    data: contents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myContent", user?.id],
    queryFn: () => contentService.getMyContent(user.id),
    enabled: !!user?.id,
  });

  const filtered =
    activeFilter === "all"
      ? contents
      : contents.filter((c) => c.status === activeFilter);

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {contents.length} total items uploaded
            </p>
          </div>
          <Link href="/teacher/upload">
            <Button>
              <Upload className="w-4 h-4" />
              Upload New
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeFilter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              {f !== "all" &&
                ` (${contents.filter((c) => c.status === f).length})`}
            </button>
          ))}
        </div>

        {error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={
              activeFilter === "all"
                ? "No content uploaded"
                : `No ${activeFilter} content`
            }
            description={
              activeFilter === "all"
                ? "Start by uploading your first piece of content."
                : `You have no ${activeFilter} content at this time.`
            }
            action={
              activeFilter === "all" && (
                <Link href="/teacher/upload">
                  <Button>
                    <Upload className="w-4 h-4" />
                    Upload Now
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <FilePreview
                  src={item.fileUrl}
                  alt={item.title}
                  className="h-44"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs font-medium text-indigo-600">
                    {item.subject}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <ScheduleBadge
                      startTime={item.startTime}
                      endTime={item.endTime}
                    />
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p>Start: {formatDate(item.startTime)}</p>
                    <p>End: {formatDate(item.endTime)}</p>
                  </div>
                  {item.status === CONTENT_STATUS.REJECTED &&
                    item.rejectionReason && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-2.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">
                          {item.rejectionReason}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

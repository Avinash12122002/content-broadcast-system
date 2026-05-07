"use client";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge, ScheduleBadge } from "@/components/shared/StatusBadge";
import { FilePreview } from "@/components/shared/FilePreview";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { contentService } from "@/services/content.service";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/helpers";
import { CONTENT_STATUS } from "@/utils/constants";
import { Upload, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const { user } = useAuth();

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

  const stats = {
    total: contents.length,
    pending: contents.filter((c) => c.status === CONTENT_STATUS.PENDING).length,
    approved: contents.filter((c) => c.status === CONTENT_STATUS.APPROVED)
      .length,
    rejected: contents.filter((c) => c.status === CONTENT_STATUS.REJECTED)
      .length,
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Here's an overview of your content
            </p>
          </div>
          <Link href="/teacher/upload">
            <Button size="md">
              <Upload className="w-4 h-4" />
              Upload Content
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatsCard
                title="Total Uploaded"
                value={stats.total}
                icon={FileText}
                color="indigo"
              />
              <StatsCard
                title="Pending Review"
                value={stats.pending}
                icon={Clock}
                color="yellow"
              />
              <StatsCard
                title="Approved"
                value={stats.approved}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="Rejected"
                value={stats.rejected}
                icon={XCircle}
                color="red"
              />
            </>
          )}
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Content</h2>
            <Link
              href="/teacher/my-content"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {error ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : isLoading ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : contents.length === 0 ? (
            <EmptyState
              title="No content yet"
              description="Upload your first content to get started"
              action={
                <Link href="/teacher/upload">
                  <Button size="sm">
                    <Upload className="w-4 h-4" />
                    Upload Now
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <FilePreview
                    src={item.fileUrl}
                    alt={item.title}
                    className="h-36"
                  />
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-gray-500">{item.subject}</p>
                    <ScheduleBadge
                      startTime={item.startTime}
                      endTime={item.endTime}
                    />
                    {item.status === "rejected" && item.rejectionReason && (
                      <p className="text-xs text-red-600 bg-red-50 rounded p-1.5 line-clamp-2">
                        ⚠ {item.rejectionReason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

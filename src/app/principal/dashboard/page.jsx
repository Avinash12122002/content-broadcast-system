"use client";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { contentService } from "@/services/content.service";
import { formatDate } from "@/utils/helpers";
import { CONTENT_STATUS } from "@/utils/constants";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrincipalDashboard() {
  const {
    data: allContents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allContent"],
    queryFn: () => contentService.getAllContent(),
  });

  const stats = {
    total: allContents.length,
    pending: allContents.filter((c) => c.status === CONTENT_STATUS.PENDING)
      .length,
    approved: allContents.filter((c) => c.status === CONTENT_STATUS.APPROVED)
      .length,
    rejected: allContents.filter((c) => c.status === CONTENT_STATUS.REJECTED)
      .length,
  };

  const pending = allContents.filter(
    (c) => c.status === CONTENT_STATUS.PENDING,
  );

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Principal Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage and approve teacher content
            </p>
          </div>
          {stats.pending > 0 && (
            <Link href="/principal/approvals">
              <Button variant="primary">Review {stats.pending} Pending</Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatsCard
                title="Total Content"
                value={stats.total}
                icon={FileText}
                color="indigo"
              />
              <StatsCard
                title="Awaiting Review"
                value={stats.pending}
                icon={Clock}
                color="yellow"
                subtitle="Needs action"
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

        {/* Pending table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
            <Link
              href="/principal/approvals"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {error ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Title", "Teacher", "Subject", "Uploaded", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={5} />
                    ))
                  ) : pending.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState
                          icon="inbox"
                          title="No pending approvals"
                          description="All content has been reviewed."
                        />
                      </td>
                    </tr>
                  ) : (
                    pending.slice(0, 5).map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.teacherName}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.subject}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

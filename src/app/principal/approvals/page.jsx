"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RejectModal } from "@/components/principal/RejectModal";
import { StatusBadge, ScheduleBadge } from "@/components/shared/StatusBadge";
import { FilePreview } from "@/components/shared/FilePreview";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ContentCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { approvalService } from "@/services/approval.service";
import { formatDate } from "@/utils/helpers";
import { CheckCircle, XCircle, Inbox } from "lucide-react";

export default function ApprovalsPage() {
  const queryClient = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState(null);

  const {
    data: pending = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pendingContent"],
    queryFn: approvalService.getPendingContent,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approvalService.approveContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingContent"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Content approved successfully!");
    },
    onError: () => toast.error("Failed to approve content"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => approvalService.rejectContent(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingContent"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      setRejectTarget(null);
      toast.success("Content rejected.");
    },
    onError: () => toast.error("Failed to reject content"),
  });

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Approvals
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pending.length > 0
              ? `${pending.length} item${pending.length > 1 ? "s" : ""} awaiting your review`
              : "No pending items"}
          </p>
        </div>

        {error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="All caught up!"
            description="There are no content items pending your approval."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pending.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <FilePreview
                  src={item.fileUrl}
                  alt={item.title}
                  className="h-52"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <ScheduleBadge
                      startTime={item.startTime}
                      endTime={item.endTime}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {item.subject}
                    </span>
                    <span>By {item.teacherName}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p>Start: {formatDate(item.startTime)}</p>
                    <p>End: {formatDate(item.endTime)}</p>
                    <p>Rotation: {item.rotationDuration}s</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      onClick={() => approveMutation.mutate(item.id)}
                      isLoading={
                        approveMutation.isPending &&
                        approveMutation.variables === item.id
                      }
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      onClick={() => setRejectTarget(item)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RejectModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        contentTitle={rejectTarget?.title}
        isLoading={rejectMutation.isPending}
        onConfirm={(reason) =>
          rejectMutation.mutate({ id: rejectTarget.id, reason })
        }
      />
    </DashboardLayout>
  );
}

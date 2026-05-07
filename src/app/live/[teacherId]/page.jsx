"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "@/services/content.service";
import { ScheduleBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatDate } from "@/utils/helpers";
import { Tv2, RefreshCw } from "lucide-react";

export default function LivePage({ params }) {
  const { teacherId } = React.use(params); // ✅ FIXED

  const {
    data: liveContents = [],
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["liveContent", teacherId],
    queryFn: () => contentService.getActiveContent(teacherId),
    refetchInterval: 30000,
    staleTime: 15000,
  });


  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Tv2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Content Broadcast</p>
              <p className="text-xs text-gray-400">
                Live • Teacher ID: {teacherId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live</span>
            <button
              onClick={refetch}
              className="ml-2 p-1.5 rounded hover:bg-gray-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error ? (
          <ErrorState
            message="Failed to load broadcast content"
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="h-52 bg-gray-700 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : liveContents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-5">
              <Tv2 className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              No content available
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              There's no active broadcast content at this time. Check back later
              or refresh the page.
            </p>
            <button
              onClick={refetch}
              className="mt-5 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold">Active Broadcast</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {liveContents.length} item{liveContents.length > 1 ? "s" : ""}{" "}
                currently live
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveContents.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <span className="inline-block bg-indigo-900 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full">
                      {item.subject}
                    </span>
                    {item.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 pt-1">
                      <p>Until: {formatDate(item.endTime)}</p>
                      <p>Rotation: every {item.rotationDuration}s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-600 mt-8 border-t border-gray-800">
        Auto-refreshes every 30 seconds • Last updated:{" "}
        {new Date(dataUpdatedAt).toLocaleTimeString()}
      </footer>
    </div>
  );
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { CONTENT_STATUS } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd MMM yyyy, hh:mm a");
  } catch {
    return dateStr;
  }
}

export function getContentScheduleStatus(startTime, endTime) {
  const now = new Date();
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  if (isBefore(now, start)) return "scheduled";
  if (isAfter(now, end)) return "expired";
  return "active";
}

export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function safeGet(obj, path, fallback = null) {
  try {
    return path.split(".").reduce((acc, key) => acc[key], obj) ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStatusColor(status) {
  const map = {
    [CONTENT_STATUS.PENDING]: "yellow",
    [CONTENT_STATUS.APPROVED]: "green",
    [CONTENT_STATUS.REJECTED]: "red",
    active: "blue",
    scheduled: "purple",
    expired: "gray",
  };
  return map[status] || "gray";
}

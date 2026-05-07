import api from "./api";
import { contentService } from "./content.service";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── localStorage helpers (same key as content service) ───
const STORAGE_KEY = "cbs_mock_contents";

function loadContents() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveContents(contents) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
  } catch {}
}

export const approvalService = {
  async getPendingContent() {
    if (USE_MOCK) {
      await delay(600);
      return loadContents().filter((c) => c.status === "pending");
    }
    const { data } = await api.get("/approvals/pending");
    return data;
  },

  async approveContent(contentId) {
    if (USE_MOCK) {
      await delay(500);
      const contents = loadContents();
      const item = contents.find((c) => c.id === contentId);
      if (item) item.status = "approved";
      saveContents(contents);
      return { success: true };
    }
    const { data } = await api.patch(`/approvals/${contentId}/approve`);
    return data;
  },

  async rejectContent(contentId, reason) {
    if (USE_MOCK) {
      await delay(500);
      const contents = loadContents();
      const item = contents.find((c) => c.id === contentId);
      if (item) {
        item.status = "rejected";
        item.rejectionReason = reason;
      }
      saveContents(contents);
      return { success: true };
    }
    const { data } = await api.patch(`/approvals/${contentId}/reject`, {
      reason,
    });
    return data;
  },
};

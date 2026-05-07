import api from "./api";

// ─── localStorage persistence helpers ───
const STORAGE_KEY = "cbs_mock_contents";

const now = new Date();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
const inFourHours = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const in2Days = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
const in3Days = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();

const DEFAULT_CONTENTS = [
  {
    id: "c1",
    teacherId: "t1",
    teacherName: "Mr. Verma",
    title: "Quadratic Equations Intro",
    subject: "Mathematics",
    description: "Visual explanation of quadratic equations and parabolas.",
    fileUrl: "https://picsum.photos/seed/math/800/600",
    fileType: "image/jpeg",
    fileName: "quadratic.jpg",
    fileSize: 204800,
    status: "approved",
    startTime: twoHoursAgo,
    endTime: inFourHours,
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: yesterday,
  },
  {
    id: "c2",
    teacherId: "t1",
    teacherName: "Mr. Verma",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    description:
      "Infographic covering all three laws with real-world examples.",
    fileUrl: "https://picsum.photos/seed/physics/800/600",
    fileType: "image/jpeg",
    fileName: "newton.jpg",
    fileSize: 307200,
    status: "pending",
    startTime: tomorrow,
    endTime: in2Days,
    rotationDuration: 20,
    rejectionReason: null,
    createdAt: twoHoursAgo,
  },
  {
    id: "c3",
    teacherId: "t2",
    teacherName: "Ms. Gupta",
    title: "Cell Structure Diagram",
    subject: "Biology",
    description: "Detailed diagram of plant and animal cells.",
    fileUrl: "https://picsum.photos/seed/bio/800/600",
    fileType: "image/jpeg",
    fileName: "cell.jpg",
    fileSize: 512000,
    status: "rejected",
    startTime: yesterday,
    endTime: twoHoursAgo,
    rotationDuration: 15,
    rejectionReason:
      "Image resolution is too low. Please upload a higher quality version.",
    createdAt: yesterday,
  },
  {
    id: "c4",
    teacherId: "t1",
    teacherName: "Mr. Verma",
    title: "World War II Timeline",
    subject: "History",
    description: "Key events and dates of WWII from 1939 to 1945.",
    fileUrl: "https://picsum.photos/seed/history/800/600",
    fileType: "image/jpeg",
    fileName: "ww2.jpg",
    fileSize: 409600,
    status: "approved",
    startTime: twoHoursAgo,
    endTime: in3Days,
    rotationDuration: 25,
    rejectionReason: null,
    createdAt: yesterday,
  },
];

// ─── Read / Write localStorage ───
function loadContents() {
  if (typeof window === "undefined") return [...DEFAULT_CONTENTS];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // First visit — seed with defaults
    const defaults = [...DEFAULT_CONTENTS];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return [...DEFAULT_CONTENTS];
  }
}

function saveContents(contents) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const contentService = {
  async getMyContent(teacherId) {
    if (USE_MOCK) {
      await delay(600);
      return loadContents().filter((c) => c.teacherId === teacherId);
    }
    const { data } = await api.get(`/content/teacher/${teacherId}`);
    return data;
  },

  async getAllContent(filters = {}) {
    if (USE_MOCK) {
      await delay(700);
      let results = loadContents();
      if (filters.status) {
        results = results.filter((c) => c.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.teacherName.toLowerCase().includes(q),
        );
      }
      return results;
    }
    const { data } = await api.get("/content", { params: filters });
    return data;
  },

  async getActiveContent(teacherId) {
    if (USE_MOCK) {
      await delay(500);
      const currentTime = new Date();
      return loadContents().filter((c) => {
        if (c.teacherId !== teacherId) return false;
        if (c.status !== "approved") return false;
        const start = new Date(c.startTime);
        const end = new Date(c.endTime);
        return currentTime >= start && currentTime <= end;
      });
    }
    const { data } = await api.get(`/content/live/${teacherId}`);
    return data;
  },

  async uploadContent(formData) {
    if (USE_MOCK) {
      await delay(1200);
      const file = formData.get("file");
      const startTime = formData.get("startTime");
      const endTime = formData.get("endTime");

      const newContent = {
        id: `c${Date.now()}`,
        teacherId: formData.get("teacherId") || "t1",
        teacherName: formData.get("teacherName") || "Mr. Verma",
        title: formData.get("title"),
        subject: formData.get("subject"),
        description: formData.get("description") || "",
        // NOTE: ObjectURL won't persist across sessions — use picsum as fallback
        fileUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
        fileType: file?.type || "image/jpeg",
        fileName: file?.name || "upload.jpg",
        fileSize: file?.size || 0,
        status: "pending",
        startTime: startTime ? new Date(startTime).toISOString() : tomorrow,
        endTime: endTime ? new Date(endTime).toISOString() : in2Days,
        rotationDuration: Number(formData.get("rotationDuration")) || 30,
        rejectionReason: null,
        createdAt: new Date().toISOString(),
      };

      const contents = loadContents();
      contents.unshift(newContent);
      saveContents(contents);
      return newContent;
    }

    const { data } = await api.post("/content", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deleteContent(contentId) {
    if (USE_MOCK) {
      await delay(400);
      const contents = loadContents().filter((c) => c.id !== contentId);
      saveContents(contents);
      return { success: true };
    }
    const { data } = await api.delete(`/content/${contentId}`);
    return data;
  },

  // ─── Utility: call this to wipe localStorage and reset to defaults ───
  resetMockData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};

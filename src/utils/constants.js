export const ROLES = {
  TEACHER: "teacher",
  PRINCIPAL: "principal",
};

export const CONTENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Physical Education",
];

export const ROUTES = {
  AUTH: "/auth",
  TEACHER_DASHBOARD: "/teacher/dashboard",
  TEACHER_UPLOAD: "/teacher/upload",
  TEACHER_MY_CONTENT: "/teacher/my-content",
  PRINCIPAL_DASHBOARD: "/principal/dashboard",
  PRINCIPAL_APPROVALS: "/principal/approvals",
  PRINCIPAL_ALL_CONTENT: "/principal/all-content",
};

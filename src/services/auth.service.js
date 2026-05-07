import api from "./api";

const MOCK_USERS = [
  {
    id: "p1",
    name: "Dr. Sharma",
    email: "principal@school.com",
    role: "principal",
    password: "principal123",
  },
  {
    id: "t1",
    name: "Mr. Verma",
    email: "teacher@school.com",
    role: "teacher",
    password: "teacher123",
  },
  {
    id: "t2",
    name: "Ms. Gupta",
    email: "teacher2@school.com",
    role: "teacher",
    password: "teacher123",
  },
];

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const authService = {
  async login(credentials) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));

      // Trim whitespace to avoid copy-paste issues
      const email = credentials.email?.trim().toLowerCase();
      const password = credentials.password?.trim();

      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email && u.password === password,
      );

      if (!user) {
        throw { response: { data: { message: "Invalid email or password" } } };
      }

      const { password: _pw, ...safeUser } = user;
      const token = btoa(
        JSON.stringify({ ...safeUser, exp: Date.now() + 86400000 }),
      );
      return { token, user: safeUser };
    }

    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  async logout() {
    if (USE_MOCK) return;
    await api.post("/auth/logout").catch(() => {});
  },

  async getProfile() {
    if (USE_MOCK) {
      const userStr = localStorage.getItem("auth_user");
      if (!userStr) throw new Error("Not authenticated");
      return JSON.parse(userStr);
    }
    const { data } = await api.get("/auth/me");
    return data;
  },
};

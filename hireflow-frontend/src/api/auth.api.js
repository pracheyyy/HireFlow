import api, { setAccessToken } from "./axiosClient";

export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  setAccessToken(null);
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/users/me", payload);
  return data.data;
};

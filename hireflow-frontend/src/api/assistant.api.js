import api from "./axiosClient";

export const getCategories = async () => {
  const { data } = await api.get("/assistant/categories");
  return data.data;
};

export const askAssistant = async (message) => {
  const { data } = await api.post("/assistant/ask", { message });
  return data.data;
};

export const getHistory = async () => {
  const { data } = await api.get("/assistant/history");
  return data.data;
};

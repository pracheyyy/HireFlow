import api from "./axiosClient";

export const createEntry = async (payload) => {
  const { data } = await api.post("/coding/entries", payload);
  return data.data;
};

export const listEntries = async () => {
  const { data } = await api.get("/coding/entries");
  return data.data;
};

export const deleteEntry = async (id) => {
  await api.delete(`/coding/entries/${id}`);
};

export const getStats = async () => {
  const { data } = await api.get("/coding/stats");
  return data.data;
};

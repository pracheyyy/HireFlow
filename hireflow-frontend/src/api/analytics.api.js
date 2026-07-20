import api from "./axiosClient";

export const getOverview = async () => {
  const { data } = await api.get("/analytics/overview");
  return data.data;
};

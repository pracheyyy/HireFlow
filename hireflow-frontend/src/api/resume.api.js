import api from "./axiosClient";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const getLatestResume = async () => {
  const { data } = await api.get("/resume/latest");
  return data.data;
};

export const getResumeHistory = async () => {
  const { data } = await api.get("/resume/history");
  return data.data;
};

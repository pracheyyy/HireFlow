import api from "./axiosClient";

export const getTopics = async () => {
  const { data } = await api.get("/interview/topics");
  return data.data;
};

export const getQuestions = async ({ type, topic, count = 5 }) => {
  const params = { type, count };
  if (topic) params.topic = topic;
  const { data } = await api.get("/interview/questions", { params });
  return data.data;
};

export const submitInterview = async ({ interviewType, topic, answers }) => {
  const { data } = await api.post("/interview/submit", { interviewType, topic, answers });
  return data.data;
};

export const getLatestSession = async () => {
  const { data } = await api.get("/interview/latest");
  return data.data;
};

export const getSessionHistory = async () => {
  const { data } = await api.get("/interview/history");
  return data.data;
};

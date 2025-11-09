import axios from "axios";
import { BACKEND_URL } from "@env";

const api = axios.create({
  baseURL: BACKEND_URL || "http://localhost:4000",
  timeout: 10000,
});

export async function fetchNews(category = "general") {
  const res = await api.get(`/news?country=in&category=${category}`);
  return res.data.articles;
}


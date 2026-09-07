import axios, { type AxiosInstance } from "axios";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://openbook-api.vercel.app"
    : import.meta.env.VITE_NODE_ENV === "preview"
      ? // Change this to your preview deployment URL
        "https://openbook-api-git-preview-ansonl.github.io"
      : "http://localhost:3000";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: baseURL,
});

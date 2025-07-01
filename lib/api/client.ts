import { API_BASE_URL } from "@/config/api";

export async function apiClient<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) throw new Error(await res.text());

  return res.json();
}

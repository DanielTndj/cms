import { apiClient } from "../client";

export async function create(data: any) {
  return apiClient("create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, body.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiGet = <T>(url: string): Promise<T> => request<T>(url);

export const apiPost = <T>(url: string, body: unknown): Promise<T> =>
  request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const apiPatch = <T>(url: string, body: unknown): Promise<T> =>
  request<T>(url, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = <T>(url: string): Promise<T> =>
  request<T>(url, { method: "DELETE" });

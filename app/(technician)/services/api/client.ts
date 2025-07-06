// Base API client untuk simulasi
export class ApiClient {
  private baseUrl: string;
  private delay: number;

  constructor(baseUrl: string = '/api', delay: number = 500) {
    this.baseUrl = baseUrl;
    this.delay = delay; // Simulasi network delay
  }

  // Simulasi HTTP request dengan delay
  private async simulateRequest<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, this.delay);
    });
  }

  async get<T>(endpoint: string, data: T): Promise<T> {
    console.log(`[API] GET ${this.baseUrl}${endpoint}`);
    return this.simulateRequest(data);
  }

  async post<T>(endpoint: string, body: any, responseData: T): Promise<T> {
    console.log(`[API] POST ${this.baseUrl}${endpoint}`, body);
    return this.simulateRequest(responseData);
  }

  async put<T>(endpoint: string, body: any, responseData: T): Promise<T> {
    console.log(`[API] PUT ${this.baseUrl}${endpoint}`, body);
    return this.simulateRequest(responseData);
  }

  async delete<T>(endpoint: string, responseData: T): Promise<T> {
    console.log(`[API] DELETE ${this.baseUrl}${endpoint}`);
    return this.simulateRequest(responseData);
  }
}

export const apiClient = new ApiClient();
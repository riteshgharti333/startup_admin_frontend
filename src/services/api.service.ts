import axiosInstance from "./axios";

// Generic API service
class ApiService {
  // GET request
  static async get<T>(url: string, params?: any): Promise<T> {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  }

  // POST request
  static async post<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  }

  // PUT request
  static async put<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  }

  // PATCH request
  static async patch<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  }

  // DELETE request
  static async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }
}

export default ApiService;
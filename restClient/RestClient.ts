import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";

export interface RequestOptions {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  config?: AxiosRequestConfig;
}

export default class RestClient {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = process.env.URL || "https://demoqa.com/") {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      validateStatus: () => true,
    });
  }

  protected async sendGet(options: RequestOptions): Promise<AxiosResponse> {
    return this.sendRequest({ ...options, method: "GET" });
  }

  protected async sendPost(options: RequestOptions): Promise<AxiosResponse> {
    return this.sendRequest({ ...options, method: "POST" });
  }

  protected async sendPut(options: RequestOptions): Promise<AxiosResponse> {
    return this.sendRequest({ ...options, method: "PUT" });
  }

  protected async sendPatch(options: RequestOptions): Promise<AxiosResponse> {
    return this.sendRequest({ ...options, method: "PATCH" });
  }

  protected async sendDelete(options: RequestOptions): Promise<AxiosResponse> {
    return this.sendRequest({ ...options, method: "DELETE" });
  }

  private async sendRequest({
    url,
    method,
    headers,
    params,
    data,
    config,
  }: RequestOptions & { method: Method }): Promise<AxiosResponse> {
    try {
      return await this.axiosInstance.request({
        url,
        method,
        headers,
        params,
        data,
        ...config,
      });
    } catch (error: any) {
      throw new Error(
        `Error occurred. Request URL: ${this.baseUrl}${url}. Stack: ${error.stack || error}`
      );
    }
  }
}

import { Guid } from "guid-typescript";
import RestClient from "../restClient/RestClient";

export class Books extends RestClient {
  url: string;
  private headers: Record<string, string>;

  constructor() {
    super();
    this.url = "/Bookstore/v1/Books";
    this.headers = {};
  }
  setAuthToken(token: string) {
    this.headers = { Authorization: `Bearer ${token}` };
  }

  async getBooks() {
    return this.sendGet({ url: `${this.url}` });
  }

  async addListOfBooks(data: any) {
    const resp = await this.sendPost({ url: `${this.url}`, data, headers: this.headers });
    return resp;
  }

  async deleteBook(data: Record<string, number | Guid>) {
    return this.sendDelete({ url: `/Bookstore/v1/Book`, data, headers: this.headers });
  }
}

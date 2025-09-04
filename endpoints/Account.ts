import { Guid } from "guid-typescript";
import RestClient from "../restClient/RestClient";
import { BaseUser } from "../utils/testsContent";

export class Account extends RestClient {
  url: string;
  private headers: Record<string, string>;

  constructor() {
    super();
    this.url = "/Account/v1";
    this.headers = {};
  }

  setAuthToken(token: string) {
    this.headers = { Authorization: `Bearer ${token}` };
  }

  async createUser(data: BaseUser) {
    const resp = await this.sendPost({ url: `${this.url}/User`, data });
    return resp;
  }

  async generateToken(data: BaseUser) {
    return this.sendPost({ url: `${this.url}/GenerateToken`, data });
  }

  async isAuthorized(data: BaseUser) {
    return this.sendPost({ url: `${this.url}/Authorized`, data, headers: this.headers });
  }

  async deleteUser(userId: Guid) {
    return this.sendDelete({ url: `${this.url}/User/${userId}`, headers: this.headers });
  }

  async getUserById(userId: Guid) {
    return this.sendGet({ url: `${this.url}/User/${userId}`, headers: this.headers });
  }
}

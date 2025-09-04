import { faker } from "@faker-js/faker";

export interface BaseUser {
  userName: string;
  password: string;
}

export const validUserData: BaseUser = {
  userName: faker.internet.userName(),
  password: "123Qwerty!",
};

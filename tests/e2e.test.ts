import { describe, expect, test } from "@jest/globals";
import { Guid } from "guid-typescript";
import { Account, Books } from "../endpoints";
import { validUserData as userPayload } from "../utils/testsContent";

let accountApi: Account;
let booksApi: Books;
let userId: Guid;
let bookId: number;

describe("E2E tests", () => {
  beforeAll(async () => {
    accountApi = new Account();
    booksApi = new Books();

    const resp = await accountApi.createUser(userPayload);
    expect(resp.status).toEqual(201);
    expect(resp.data.userID).toBeDefined();
    expect(resp.data.username).toEqual(userPayload.userName);
    userId = resp.data.userID;
    await new Promise((res) => setTimeout(res, 1000));

    const respToken = await accountApi.generateToken(userPayload);
    expect(respToken.status).toEqual(200);
    expect(respToken.data.token).toBeDefined();
    expect(respToken.data.status).toEqual("Success");
    expect(respToken.data.result).toEqual("User authorized successfully.");
    accountApi.setAuthToken(respToken.data.token);
    booksApi.setAuthToken(respToken.data.token);
  });

  afterAll(async () => {
    const resp = await accountApi.deleteUser(userId);
    expect(resp.status).toEqual(204);
  });

  test("Check is current user logged in", async () => {
    const resp = await accountApi.isAuthorized(userPayload);
    expect(resp.status).toEqual(200);
    expect(resp.data).toEqual(true);
  });

  test("Getting current user and check list of books", async () => {
    const resp = await accountApi.getUserById(userId);
    expect(resp.status).toEqual(200);
    expect(resp.data.userId).toEqual(userId);
    expect(resp.data.username).toEqual(userPayload.userName);
    expect(resp.data.books).toStrictEqual([]);
  });

  test("Getting list of all books", async () => {
    const resp = await booksApi.getBooks();
    expect(resp.status).toEqual(200);
    expect(resp.data.books).toBeDefined();
    bookId = resp.data.books[0].isbn;
  });

  test("Adding book to the user", async () => {
    const resp = await booksApi.addListOfBooks({
      userId,
      collectionOfIsbns: [
        {
          isbn: bookId,
        },
      ],
    });
    expect(resp.status).toEqual(201);
    expect(resp.data.books).toBeDefined();
    expect(resp.data.books[0].isbn).toEqual(bookId);
  });

  test("Delete book from the user", async () => {
    const resp = await booksApi.deleteBook({
      isbn: bookId,
      userId,
    });
    expect(resp.status).toEqual(204);

    const respGet = await accountApi.getUserById(userId);
    expect(respGet.data.books).toStrictEqual([]);
  });
});

const { connect, closeConnection } = require("../index");
const config = require("config");
const { getToken, get, post, put, deleteRequest } = require("./utils/index");

let userToken;
let adminToken;

const userId = "615f0554fd864adb9d323682";
const baseUrl = config.get("ROUTES.USER");

const userBody = {
  username: "name",
  email: "email@gmail.com",
  password: "password",
  isAdmin: false,
};

beforeAll(async () => {
  await connect();
  userToken = await getToken({
    email: "user@gmail.com",
    password: "user",
  });
  adminToken = await getToken({
    email: "admin@gmail.com",
    password: "admin",
  });
});

afterAll(async () => {
  await closeConnection();
});

describe("Get All User", () => {
  const url = `${baseUrl}/all`;

  test("admin request", async () => {
    const response = await get(url, adminToken, 200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("User request", async () => {
    await get(url, userToken, 403);
  });
});

describe("Find user By Id", () => {
  const url = `${baseUrl}/find/${userId}`;

  test("admin request", async () => {
    await get(url, adminToken, 200);
  });

  test("User request", async () => {
    await get(url, userToken, 403);
  });
});

describe("Update User", () => {
  let newUser;
  let url;

  const updatedUser = {
    ...userBody,
    isAdmin: true,
  };

  beforeEach(async () => {
    const createUrl = `${baseUrl}/create`;
    const response = await post(createUrl, adminToken, userBody, 201);
    newUser = response.body.user;
    url = `${baseUrl}/update/${newUser._id}`;
  });

  afterEach(async () => {
    const deleteUrl = `${baseUrl}/delete/${newUser._id}`;
    await deleteRequest(deleteUrl, adminToken, 200);
  });

  test("admin request", async () => {
    const response = await put(url, adminToken, updatedUser, 200);
    expect(response.body.user.isAdmin).toBe(true);
  });

  test("User request", async () => {
    await put(url, userToken, updatedUser, 403);
  });
});

describe("Delete User", () => {
  let url;
  let badUrl;
  let newUser;

  beforeEach(async () => {
    const createUrl = `${baseUrl}/create`;
    const response = await post(createUrl, adminToken, userBody, 201);
    newUser = response.body.user;
    badUrl = `${baseUrl}/delete/333aa3a33a33aa333333aaaa`;
    url = `${baseUrl}/delete/${newUser._id}`;
  });

  afterEach(async () => {
    const deleteUrl = `${baseUrl}/delete/${newUser._id}`;
    await deleteRequest(deleteUrl, adminToken, 200);
  });

  test("User request", async () => {
    await deleteRequest(url, userToken, 403);
  });
  
  test("User that does not exist", async () => {
    await deleteRequest(badUrl, adminToken, 404);
  });
});

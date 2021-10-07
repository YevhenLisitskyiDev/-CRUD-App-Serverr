const { connect, closeConnection } = require("../index");
const { v4: uuid } = require("uuid");
const { get, post, deleteRequest } = require("./utils/index");
const config = require("config");

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeConnection();
});

describe("Create User", () => {
  const url = `${config.get("ROUTES.USER")}/create`;

  test("Successful user create", async () => {
    const username = uuid();
    const userBody = {
      username,
      email: `${username}@gmail.com`,
      password: `${username}`,
      isAdmin: true,
    };
    const response = await post(url, "", userBody, 201);
    expect(response.body.user).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    const deleteUrl = `${config.get("ROUTES.USER")}/delete/${
      response.body.user._id
    }`;
    await deleteRequest(deleteUrl, response.body.token, 200);
  });

  test("User already exists", async () => {
    const userBody = {
      username: "admin",
      email: "admin@gmail.com",
      password: "admin",
      isAdmin: true,
    };
    await post(url, "", userBody, 400);
  });

  test("Empty body", async () => {
    const userBody = {
      username: "",
      email: "",
      password: "",
      isAdmin: true,
    };
    await post(url, "", userBody, 400);
  });

  test("Email validation", async () => {
    const userBody = {
      username: "username",
      email: "bad email",
      password: "password",
      isAdmin: true,
    };
    const response = await post(url, "", userBody, 400);
    expect(response.body.message).toBe("Email don't valid");
  });
});

describe("Login User", () => {
  const url = config.get("ROUTES.USER") + "/login";

  test("Successful user login", async () => {
    const userBody = {
      email: "admin@gmail.com",
      password: "admin",
    };
    const response = await post(url, "", userBody, 200);
    expect(response.body.user).toBeTruthy();
    expect(response.body.token).toBeTruthy();
  });

  test("Can't find user", async () => {
    const userBody = {
      email: "thisUserDon'tExist@gmail.com",
      password: "123",
    };
    const response = await post(url, "", userBody, 400);
    expect(response.body.message).toBe("User not found");
  });

  test("User password incorrect", async () => {
    const userBody = {
      email: "admin@gmail.com",
      password: "123",
    };
    const response = await post(url, "", userBody, 400);
    expect(response.body.message).toBe("Password is incorrect");
  });
});

describe("Authenticate User", () => {
  const url = config.get("ROUTES.USER") + "/auth";

  test("Successful user auth", async () => {
    const userBody = {
      email: "admin@gmail.com",
      password: "admin",
    };
    const loginUrl = `${config.get("ROUTES.USER")}/login`;
    const response = await post(loginUrl, "", userBody, 200);
    const token = response.body.token;
    await get(url, token, 200);
  });

  test("Empty token", async () => {
    await get(url, "", 500);
  });

  test("Bad token", async () => {
    const token = "bad";
    await get(url, token, 500);
  });
});

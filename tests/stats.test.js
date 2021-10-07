const { connect, closeConnection } = require("../index");
const config = require("config");
const { getToken, get } = require("./utils/index");

let userToken;
let admin;

beforeAll(async () => {
  await connect();
  userToken = await getToken({
    email: "user@gmail.com",
    password: "user",
  });
  admin = await getToken({
    email: "admin@gmail.com",
    password: "admin",
  });
});

afterAll(async () => {
  await closeConnection();
});

describe("Get Stats", () => {
  const url = `${config.get("ROUTES.STATS")}/`;
  
  test("Admin request", async () => {
    await get(url, admin, 200);
  });

  test("User request", async () => {
    await get(url, userToken, 403);
  });
});

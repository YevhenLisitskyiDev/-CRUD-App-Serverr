const { connect, closeConnection } = require("../index");
const config = require("config");
const { getToken, get, post, put, deleteRequest } = require("./utils/index");

let user;
let admin;
let profilesOwner;
const baseUrl = config.get("ROUTES.PROFILES");

const profileBody = {
  name: "profile",
  gender: "male",
  birthdate: "2000-01-01",
  city: "Kyiv",
};

const userId = "615f0554fd864adb9d323682";

beforeAll(async () => {
  await connect();
  user = await getToken({
    email: "user@gmail.com",
    password: "user",
  });
  admin = await getToken({
    email: "admin@gmail.com",
    password: "admin",
  });
  profilesOwner = await getToken({
    email: "test@gmail.com",
    password: "test",
  });
});

afterAll(async () => {
  await closeConnection();
});

describe("Get All Profiles", () => {
  const url = `${baseUrl}/all`;
  test("Admin request", async () => {
    const response = await get(url, admin, 200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  test("User request", async () => {
    await get(url, user, 403);
  });
});

describe("Get User Profiles", () => {
  const url = `${baseUrl}/user/${userId}`;

  test("Admin request", async () => {
    const response = await get(url, admin, 200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Profiles owner request", async () => {
    const response = await get(url, profilesOwner, 200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("User request", async () => {
    await get(url, user, 403);
  });
});

describe("Create Profile", () => {
  const url = `${baseUrl}/create/${userId}`;

  let profile = {
    name: "profile",
    gender: "male",
    birthdate: "2000-01-01",
    city: "Kyiv",
  };

  test("Admin request", async () => {
    const response = await post(url, admin, profile, 201);
    const deleteUrl = `${baseUrl}/delete/${userId}/${response.body.profile._id}`;
    await deleteRequest(deleteUrl, admin, 200);
  });

  test("Profiles owner request", async () => {
    const response = await post(url, profilesOwner, profile, 201);
    const deleteUrl = `${baseUrl}/delete/${userId}/${response.body.profile._id}`;
    await deleteRequest(deleteUrl, admin, 200);
  });

  test("User request", async () => {
    await post(url, user, profile, 403);
  });

  test("Empty profile", async () => {
    await post(url, admin, { ...profile, name: "" }, 400);
  });

  test("Birthdate latter than current date", async () => {
    let birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() + 1);
    birthdate = `${birthdate.getFullYear()}-${
      birthdate.getMonth() + 1
    }-${birthdate.getDay()}`;
    await post(url, admin, { ...profile, birthdate }, 400);
  });
});

describe("Update Profile", () => {
  let profile;
  let url;

  const updatedProfile = {
    ...profileBody,
    name: "updated",
  };

  beforeEach(async () => {
    const createUrl = `${baseUrl}/create/${userId}`;
    const response = await post(createUrl, admin, profileBody, 201);
    profile = response.body.profile;
    url = `${baseUrl}/update/${userId}/${profile._id}`;
  });

  afterEach(async () => {
    const deleteUrl = `${baseUrl}/delete/${userId}/${profile._id}`;
    await deleteRequest(deleteUrl, admin, 200);
  });

  test("Admin request", async () => {
    const response = await put(url, admin, updatedProfile, 200);
    expect(response.body.profile).toEqual({ ...profile, name: "updated" });
  });

  test("Profiles owner request", async () => {
    const response = await put(url, profilesOwner, updatedProfile, 200);
    expect(response.body.profile).toEqual({ ...profile, name: "updated" });
  });

  test("User request", async () => {
    await put(url, user, updatedProfile, 403);
  });
});

describe("Delete Profile", () => {
  let url;
  let badUrl;

  beforeEach(async () => {
    const createUrl = `${baseUrl}/create/${userId}`;
    const response = await post(createUrl, admin, profileBody, 201);
    profile = response.body.profile;
    badUrl = `${config.get(
      "ROUTES.PROFILES"
    )}/delete/${userId}/333aa3a33a33aa333333aaaa`;
    url = `${baseUrl}/delete/${userId}/${profile._id}`;
  });

  test("Admin request", async () => {
    await deleteRequest(url, admin, 200);
  });
  
  test("Profiles owner request", async () => {
    await deleteRequest(url, profilesOwner, 200);
  });

  test("User request", async () => {
    await deleteRequest(url, user, 403);

    //delete User from db
    await deleteRequest(url, admin, 200);
  });
  
  test("Profile that does not exist", async () => {
    await deleteRequest(badUrl, admin, 404);

    //delete User from db
    await deleteRequest(url, admin, 200);
  });
});

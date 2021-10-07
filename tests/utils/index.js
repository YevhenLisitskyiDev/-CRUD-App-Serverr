const request = require("supertest");
const {app} = require("../../index");
const config = require("config");

const getToken = async (body) => {
  const response = await request(app)
    .post(config.get("ROUTES.USER") + "/login")
    .send(body);
  return response.body.token;
};
const get = async (path, token, expectedStatus) => {
  return await request(app)
    .get(path)
    .set("Authorization", `Bearer ${token}`)
    .expect(expectedStatus);
};

const post = async (path, token, body, expectedStatus) => {
  return await request(app)
    .post(path)
    .set("Authorization", `Bearer ${token}`)
    .send(body)
    .expect(expectedStatus);
};

const deleteRequest = async (path, token, expectedStatus) => {
  return await request(app)
    .delete(path)
    .set("Authorization", `Bearer ${token}`)
    .expect(expectedStatus);
};

const put = async (path, token, body, expectedStatus) => {
  return await request(app)
    .put(path)
    .set("Authorization", `Bearer ${token}`)
    .send(body)
    .expect(expectedStatus);
};

module.exports = {
  getToken,
  get,
  post,
  put,
  deleteRequest,
};

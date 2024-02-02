
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("User Controller - End-to-End Tests", () => {
  it("should get all users", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.users).to.be.an("array");
        done();
      });
  });

  it("should create a new user", (done) => {
    chai
      .request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "password", role: "user" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("User registered successfully");
        done();
      });
  });

});

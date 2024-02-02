const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Entry Controller - End-to-End Tests", () => {
  it("should get all entries", (done) => {
    chai
      .request(app)
      .get("/entries")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.entries).to.be.an("array");
        done();
      });
  });

  it("should create a new entry", (done) => {
    chai
      .request(app)
      .post("/entries")
      .send({ userId: 1, date: "2024-02-02", distance: 5.2, time: "30:00", location: "Park" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Entry created successfully");
        done();
      });
  });

});

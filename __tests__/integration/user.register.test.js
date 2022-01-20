process.env.NODE_ENV = "test";
const db = require('../../db/db_config');
const request = require("supertest");
const app = require("../../api");

beforeAll(async () => {
    await db.query("CREATE TABLE demoUsers (id SERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,phone VARCHAR(12) NOT NULL UNIQUE,isBlocked BOOLEAN DEFAULT false,iSDeleted BOOLEAN DEFAULT false,password TEXT NOT NULL,createdat timestamp without time zone default (now() at time zone 'utc'),LastUpdatedAt TIMESTAMPTZ)")
    await db.query("CREATE TABLE roles (id SERIAL PRIMARY KEY,userid INTEGER NOT NULL,isTeacher BOOLEAN DEFAULT false,isStudent BOOLEAN DEFAULT false)")
  });

beforeEach(async () => {
    await db.query("DELETE FROM demoUsers");
    await db.query("DELETE FROM roles");
})

afterAll(async () => {
    await db.query("DROP TABLE demoUsers");
    await db.query("DROP TABLE roles");
    db.end();
  });

  // FOR REGISTERING WITH EMPTY FIELD

  describe("POST /register",()=> {
    test("it should respond with not empty field message", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "anitada@gmail.com",
        password: "Secret123@"
      });
      expect(response.body).toBe("email or phone or password field can not be empty");
    })
  });

  

  // FOR INVALID EMAIL FORMAT

  describe("POST /register",()=> {
    test("it should respond with invalid email format", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "anitadasgmail.com",
        phone: "917735987412",
        password: "Secret123@"
      });
      expect(response.body).toBe("email is not in valid format");
    })
  });




  // FOR INVALID PHONE FORMAT

  describe("POST /register",()=> {
    test("it should respond with invalid phone number format", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "amitdas@gmail.com",
        phone: "55987412",
        password: "Secret123@"
      });
      expect(response.body).toBe("phone number is not in valid format");
    })
  });




  // PASSWORD MUST CONTAIN A NUMBER

  describe("POST /register",()=> {
    test("password must contain a number", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "souvik@gmail.com",
        phone: "35987412",
        password: "Secret@"
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });




  // PASSWORD MUST CONTAIN A CAP ALPHABET

  describe("POST /register",()=> {
    test("password must contain a capital alphabet", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "ravidas@gmail.com",
        phone: "35988412",
        password: "secret@123"
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });




  // PASSWORD MUST CONTAIN A SMALL ALPHABET

  describe("POST /register",()=> {
    test("password must contain a small alphabet", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "anupdas@gmail.com",
        phone: "35997412",
        password: "SECRET@123"
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });




  // PASSWORD MUST CONTAIN A SPECIAL CHARACTER  

  describe("POST /register",()=> {
    test("password must contain a special character", async () =>{
      const response = await request(app)
      .post("/api/register")
      .send({
        email: "anitaray@gmail.com",
        phone: "35987712",
        password: "Secret123"
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });



  describe("Test a 404", () => {
    test("It should respond with a 404 status", async () => {
      const response = await request(app).get("/nowhere");
      expect(response.statusCode).toBe(404);
    });
  });


process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../api");

// to test for unsuccessful login

describe("POST /register",()=> {
    test("it is a test for successful registration", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "Suras",
        lastName: "Annam",
        email:"suman@gmail.com",
        phone:"919098899454",
        password:"Default1@",
        isStudent: false,
        isTeacher: true  
      });
      expect(response.body).toBe("successfully registered");
    })
  })

// to test for successful login

describe("POST /login",()=> {
    test("it should test for successful login", async () =>{
      const response = await request(app)
      .post("/api/login")
      .send({
        email: "suman@gmail.com",
        password: "Default1@"
      });
      expect(response.body).toHaveProperty("expiresAt");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("userInfo");
      expect(response.statusCode).toBe(200);
    })
  });




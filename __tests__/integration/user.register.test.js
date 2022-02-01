process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../api");
const db = require('../../db/db_config');

  afterAll(async () => {
    await db.query("DELETE FROM roles r USING users u WHERE r.id = u.id AND u.email='suraj@gmail.com'");
    await db.query("DELETE FROM roles r USING users u WHERE r.id = u.id AND u.email='suman@gmail.com'");
    await db.query("DELETE FROM users WHERE email = 'suraj@gmail.com'");
    await db.query("DELETE FROM users WHERE email = 'suman@gmail.com'");
  });


// FOR REGISTERING WITH EMPTY FIELD

  describe("POST /register",()=> {
    test("it should respond with not empty field message", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitada@gmail.com",
        password: "Secret123@"
      });
      expect(response.body).toBe("email or phone or password field can not be empty");
    })
  });

// to test for invalid email format

  describe("POST /register",()=> {
    test("it should test for invalid email format", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadagmail.com",
        phone:"919088899454",
        password:"Default1@",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("email is not in valid format");
    })
  });

// to test for invalid phone format

  describe("POST /register",()=> {
    test("it should test invalid phone format", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadas@gmail.com",
        phone:"088899454",
        password:"Default1@",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("phone number is not in valid format");
    })
  });


 // to test invalid password format for missing capital letter

  describe("POST /register",()=> {
    test("it should test invalid password format for missing capital letter", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadas@gmail.com",
        phone:"088899454",
        password:"efault1@",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });

// to test invalid password format for missing small letter

  describe("POST /register",()=> {
    test("it should test invalid password format for missing small letter", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadas@gmail.com",
        phone:"088899454",
        password:"DEFAULT1@",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });

// to test invalid password format for missing NUMERIC value

  describe("POST /register",()=> {
    test("it should test invalid password format for missing NUMERIC value", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadas@gmail.com",
        phone:"088899454",
        password:"Default@",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });

// to test for invalid password format for missing special character 

  describe("POST /register",()=> {
    test("it should test invalid password format for missing special character", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "anita",
        lastName: "dash",
        email: "anitadas@gmail.com",
        phone:"088899454",
        password:"Default",
        isStudent: false,
        isTeacher: true
      });
      expect(response.body).toBe("password is not in valid format");
    })
  });

// to test for successful registration  

  describe("POST /register",()=> {
    test("it is a test for successful registration", async () =>{
      const response = await request(app)
      .post("/new/register")
      .send({
        firstName: "Suras",
        lastName: "Annam",
        email:"suraj@gmail.com",
        phone:"919088899454",
        password:"Default1@",
        isStudent: false,
        isTeacher: true  
      });
      expect(response.body).toBe("successfully registered");
    })
  })



  describe("Test a 404", () => {
    test("It should respond with a 404 status", async () => {
      const response = await request(app).get("/nowhere");
      expect(response.statusCode).toBe(404);
    });
  });


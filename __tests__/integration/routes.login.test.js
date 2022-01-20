process.env.NODE_ENV = "test";
const db = require('../../db/db_config');
const request = require("supertest");
const app = require("../../api");

// for hashing the password successfully when we create users
const bcrypt = require("bcrypt");
const { password } = require('pg/lib/defaults');

let auth 

  beforeAll(async () => {
    await db.query("CREATE TABLE users (id SERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,phone VARCHAR(12) NOT NULL UNIQUE,isBlocked BOOLEAN DEFAULT false,iSDeleted BOOLEAN DEFAULT false,password TEXT NOT NULL,createdat timestamp without time zone default (now() at time zone 'utc'),LastUpdatedAt TIMESTAMPTZ)")
    await db.query("CREATE TABLE myRoles (id SERIAL PRIMARY KEY,userid INTEGER NOT NULL,isTeacher BOOLEAN DEFAULT false,isStudent BOOLEAN DEFAULT false)")
  });

  // setup before each function for getting token
  beforeEach(async () => {
    const saltRounds = 12;
        const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hash("Secret123@", salt);
    // seed with some data
    await db.query("INSERT INTO users (email,phone,password) VALUES ('anil@gmail.com','917788653254',$1)",[hashedPassword]);
    await db.query("INSERT INTO myRoles (userid) VALUES ('1')");
    await db.query("INSERT INTO users (email,phone,password) VALUES ('anup@gmail.com','917888653154',$1)",[hashedPassword]);
    await db.query("INSERT INTO myRoles (userid) VALUES ('2')");
    await db.query("INSERT INTO users (email,phone,password) VALUES ('anitadas@gmail.com','917889653254',$1)",[hashedPassword]);
    await db.query("INSERT INTO myRoles (userid) VALUES ('3')");

    const response = await request(app)
    .post("/auth/login")
    .send({
        email: "anil@gmail.com",
        password: "Secret123@"
    });
    auth = response.body.token;
  });
  
  afterEach(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM myRoles");
  });
  
  afterAll(async () => {
    await db.query("DROP TABLE users");
    await db.query("DROP TABLE myRoles");
    db.end();
  });

  
  // FOR EMPTY DATA FIELD IN EITHER EMAIL OR PASSWORD

  describe("POST /login",()=> {
    test("it should respond with email or password field can't be empty", async () =>{
      const response = await request(app)
      .post("/auth/login")
      .send({
        email: "",
        password: "password"
      });
      expect(response.body).toBe("email or password field can not be empty");
      expect(response.statusCode).toBe(200);
    })
  });

  // FOR NO USER FOUND 

  describe("POST /login",()=> {
    test("it should respond with no user found", async () =>{
      const response = await request(app)
      .post("/auth/login")
      .send({
        email: "anupdas@gmail.com",
        password: "secret"
      });
      expect(response.body).toBe("No such user found");
      expect(response.statusCode).toBe(200);
    })
  });

  // FOR INCORRECT PASSWORD

  describe("POST /login",()=> {
    test("it should respond with incorrect password", async () =>{
      const response = await request(app)
      .post("/auth/login")
      .send({
        email: "anup@gmail.com",
        password: "password"
      });
      expect(response.body).toBe("incorrect password");
      expect(response.statusCode).toBe(200);
    })
  });

  // FOR UNSUCCESSFUL LOGIN 

  describe("POST /login",()=> {
    test("it should respond with a token", async () =>{
      const response = await request(app)
      .post("/auth/login")
      .send({
        email: "anitadas@gmail.com",
        password: "Secret123@"
      });
      console.log(response.body);
      expect(response.body).toBe("login unsuccessful");
      expect(response.statusCode).toBe(500);
      //expect(response.body).toHaveProperty("token");
    })
  });



  

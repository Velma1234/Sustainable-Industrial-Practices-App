require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcrypt");

// initiating app
const app = express();

// configuring middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// configuring session middleware
app.use(
  session({
    secret: "hgfsfapPouqitfsrq54aoapo[p]f",
    resave: false,
    saveUninitialized: false,
  })
);

// creating connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// checking connection to db
connection.connect((err) => {
  if (err) {
    console.error("Error occurred while connecting to database" + err.stack);
    return;
  }
  console.log("Database server Successfully Connected");
});

// defining registration form route
app.get("/register", (request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

// login route
app.get("/login", (request, response) => {
  response.sendFile(path.join(__dirname, "login.html"));
});

// defining user object registration
const User = {
  tableName: "users",

  createUser: function (newUser, callback) {
    connection.query(
      "INSERT INTO " + this.tableName + " SET ?",
      newUser,
      callback
    );
  },

  getUserByEmail: function (email) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM " + this.tableName + " WHERE email = ?",
        [email],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  getUserByFirstname: function (firstname, callback) {
    connection.query(
      "SELECT * FROM " + this.tableName + " WHERE firstname = ?",
      firstname,
      callback
    );
  },

  getUserByLastname: function (lastname, callback) {
    connection.query(
      "SELECT * FROM " + this.tableName + " WHERE lastname = ?",
      lastname,
      callback
    );
  },
};

// defining registration route and logic
app.post(
  "/register",
  [
    check("email").isEmail().withMessage("Provide a valid Email address"),
    check("firstname")
      .isAlphanumeric()
      .withMessage("Invalid firstname, provide alphanumeric values"),
    check("lastname")
      .isAlphanumeric()
      .withMessage("Invalid lastname, provide alphanumeric values"),
    check("email").custom(async (value) => {
      const exist = await User.getUserByEmail(value);
      if (exist.length > 0) {
        throw new Error("User Already Exists");
      }
    }),
  ],
  async (request, response) => {
    // validation check
    const error = validationResult(request);
    if (!error.isEmpty()) {
      return response.status(400).json({ error: error.array() });
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

    // define a new user object
    const newUser = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: hashedPassword,
    };

    // saving new user
    User.createUser(newUser, (error) => {
      if (error) {
        console.error(
          "An error occurred while saving the record" + error.message
        );
        return response.status(500).json({ error: error.message });
      }
      console.log("New user record saved");
      response.status(202).send("Registration Successful");
      
    });
  }
);

// handling login form authentication
app.post("/login", (request, response) => {
  const { email, password } = request.body;
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        response.status(401).send("Invalid username or password");
      } else {
        const user = result[0];
        // compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            request.session.user = user;
            response.status(200).json({ message: "Login successful" });
          } else {
            response.status(401).send("Invalid username or password");
          }
        });
      }
    }
  );
});

// start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

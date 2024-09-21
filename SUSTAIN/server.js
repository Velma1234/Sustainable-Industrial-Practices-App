require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express(); //initiating app

//session middle ware

app.use(
  session({
    secret: "gftudvjhhjhhvg4875rcvvte44456t555dc",
    resave: false,
    saveUninitialized: false,
  })
);

//connecting to db
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to mySQL");
  }
  console.log("Successfully connected to mysql");
});

//serve static files
app.use(express.static(__dirname));

//middleware handling incoming data

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// defining routes
// registration route
app.get("/register", (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"));
});

//  user registration logic
const User = {
  tableName: "users",
  createUser: function (newUser, callback) {
    connection.query(
      "INSERT INTO " + this.tableName + " SET ?",
      newUser,
      callback
    );
  },

  getUserByEmail: function (email, callback) {
    connection.query(
      "SELECT * FROM " + this.tableName + " WHERE email = ?",
      [email],
      callback
    );
  },

  getUserByUsername: function (username, callback) {
    connection.query(
      "SELECT * FROM " + this.tableName + " WHERE username = ?",
      [username],
      callback
    );
  },
};

//registration form data handling
app.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a Valid Email Address !"),
    check("username")
      .isAlphanumeric()
      .withMessage("Username must be Alphanumeric"),

    //uniqueness of user
    check("email").custom(async (value) => {
      return new Promise((resolve, reject) => {
        User.getUserByEmail(value, (err, results) => {
          if (err) return reject(err);
          if (results.length > 0)
            return reject(new Error("Email already exists!"));
          resolve();
        });
      });
    }),
    check("username").custom(async (value) => {
      return new Promise((resolve, reject) => {
        User.getUserByUsername(value, (err, results) => {
          if (err) return reject(err);
          if (results.length > 0)
            return reject(new Error("Username already exists!"));
          resolve();
        });
      });
    }),
  ],
  async (req, res) => {
    //checking validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    //creating new user object
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    //saving user
    User.createUser(newUser, (error, result, fields) => {
      if (error) {
        console.error("Error inserting new User record: " + error.message);
        return res.status(500).json({ error: error.message });
      }
      console.log("New User successfully created.");
      res.status(201).json(newUser);
    });
  }
);

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists by email
  User.getUserByEmail(email, async (err, results) => {
    if (err) {
      console.error("Error fetching user: " + err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If not user is found
    if (results.length === 0) {
      return res.status(400).json({ error: "User not found!" });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    res
      .status(200)
      .json({
        message: "Login successful",
        user: { email: user.email, username: user.username },
      });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

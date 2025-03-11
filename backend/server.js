require("dotenv").config(); // Load .env variables
const { Client } = require("pg");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// DB CONNECTION
const con = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Connect to DB
con.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

const app = express();
const port = 3001;

// Middleware to enable JSON parsing and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("backend online");
});

// Retrieve Recipe List
app.post("/api/recipes", async (req, res) => {
  const { prompt } = req.body;
  const chatSession = model.startChat({
    generationConfig,
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    res.send(result.response.text());
  } catch (err) {
    console.error("API fetch error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Retrieve Inventory
app.get("/api/inventory", async (req, res) => {
  const { user } = req.query;
  try {
    const result = await con.query(
      "SELECT * FROM inventorytable WHERE userid = $1",
      [user]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Retrieve Inventory Item Names
app.get("/api/inventory/names", async (req, res) => {
  const { user } = req.query;
  try {
    const result = await con.query(
      "SELECT DISTINCT name FROM inventorytable WHERE userid = $1",
      [user]
    );
    res.json(result.rows.map((row) => row.name));
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Add Grocery
app.post("/api/inventory/add", async (req, res) => {
  const { user, name, quantity, barcode } = req.query;

  if (!user || isNaN(parseInt(user, 10))) {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

  try {
    const insertQuery = `
            INSERT INTO inventorytable (name, quantity, barcode, userid)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const insertResult = await con.query(insertQuery, [
      name,
      quantity,
      barcode,
      parseInt(user, 10),
    ]);

    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding entry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Grocery
app.delete("/api/inventory/delete", async (req, res) => {
  const { user, id } = req.query;
  try {
    const result = await con.query(
      "DELETE FROM inventorytable WHERE userid = $1 AND id = $2 RETURNING *",
      [user, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const queryText = "SELECT * FROM profiletable WHERE email = $1";
    const result = await con.query(queryText, [email]);

    if (result.rows.length === 0) {
      // No user found with that email
      return res
        .status(401)
        .json({ message: "Invalid credential -- Email not found" });
    }

    const user = result.rows[0];

    // Compare password with the stored hashed password
    const passwordMatch = await Promise.resolve(
      bcrypt.compare(password, user.password)
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .json({
          message: "Invalid credentials -- Matching password not found",
        });
    }
    res.json({ userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// SignUp
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Check if a user with this email already exists
    const checkQuery = "SELECT * FROM profiletable WHERE email = $1";
    const checkResult = await con.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the profile table
    const insertQuery = `
      INSERT INTO profiletable (email, password)
      VALUES ($1, $2)
      RETURNING *
    `;
    const insertResult = await con.query(insertQuery, [email, hashedPassword]);

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Retrieve User Email
app.get("/api/email", async (req, res) => {
  const { user } = req.query;
  try {
    const result = await con.query(
      "SELECT email FROM profiletable WHERE id = $1",
      [user]
    );
    res.json(result.rows.map((row) => row.email));
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Error fetching email" });
  }
});

// Listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

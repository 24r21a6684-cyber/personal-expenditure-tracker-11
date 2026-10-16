require("dotenv").config({ path: require("path").join(__dirname, ".env") });
console.log("ENV loaded:", Boolean(process.env.MONGODB_URI));
console.log("URI starts correctly:", /^(mongodb\+srv|mongodb):\/\//.test(process.env.MONGODB_URI || ""));
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_URI || "");
let expenses;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/expenses", async (req, res) => {
  try {
    res.json(await expenses.find().sort({ date: -1, _id: -1 }).toArray());
  } catch {
    res.status(500).json({ error: "Unable to load expenses." });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { name, amount, category, date } = req.body;
    const value = Number(amount);
    if (!String(name || "").trim() || !Number.isFinite(value) || value <= 0 || !category || !date) {
      return res.status(400).json({ error: "Enter a name, a positive amount, category, and date." });
    }
    const expense = {
      name: String(name).trim().slice(0, 100),
      amount: value,
      category: String(category).slice(0, 40),
      date: String(date),
      createdAt: new Date()
    };
    const result = await expenses.insertOne(expense);
    res.status(201).json({ ...expense, _id: result.insertedId });
  } catch {
    res.status(500).json({ error: "Unable to save the expense." });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid expense ID." });
    const result = await expenses.deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "Expense not found." });
    res.json({ message: "Expense deleted." });
  } catch {
    res.status(500).json({ error: "Unable to delete the expense." });
  }
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("MongoDB connection missing. Create a .env file from .env.example.");
    process.exit(1);
  }
  await client.connect();
  expenses = client.db(process.env.DB_NAME || "expenseDB").collection("expenses");
  app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
}

start().catch(error => {
  console.error("Could not connect to MongoDB. Check .env and Atlas Network Access.");
  console.error(error.message);
  process.exit(1);
});

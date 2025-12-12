const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
require("dotenv").config({ path: ".env.prod" })

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const conn = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

app.get("/", (req, res) => {
  const server = {
    message: "Welcome to the Attractions API",
    time: new Date().toISOString(),
    version: "1.0.0",
  }
  res.json(server)
})

app.get("/health", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT 1 AS ok")
    res.json({ status: "ok", db: rows[0].ok === 1 })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: "error", message: e.message })
  }
})

app.get("/attractions", async (req, res) => {
  try {
    const sql =
      "SELECT att.*, count(lk.id) AS likes FROM Attraction att LEFT JOIN `Like` lk ON att.id = lk.attractionId GROUP BY att.id;"
    const [rows] = await conn.query(sql)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/attractions/:id", async (req, res) => {
  const id = req.params.id
  try {
    const sql =
      "SELECT att.*, count(lk.id) AS likes FROM Attraction att LEFT JOIN `Like` lk ON att.id = lk.attractionId WHERE att.id = ?;"
    const [rows] = await conn.query(sql, [id])

    if (rows.length > 0 && rows[0].id !== null) {
      res.json(rows[0]) // Return the first (and only) result
    } else {
      res.json({ message: "No attraction found with id: " + id, ok: false }) // No user found with that ID
      console.log("No attraction found with id:", id)
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.post("/attractions/:id/like", async (req, res) => {
  const id = req.params.id
  try {
    const sql = "INSERT INTO `Like` (attractionId) VALUES (?);"
    await conn.execute(sql, [id])

    const [rows] = await conn.query(
      "SELECT COUNT(*) AS likeCount FROM `Like` WHERE attractionId = ?;",
      [id]
    )
    const likeCount = rows[0].likeCount
    res.status(200).json({ message: "Like added", ok: true, likes: likeCount })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.delete("/attractions/:id/like", async (req, res) => {
  const id = req.params.id
  try {
    const sql =
      "DELETE FROM `Like` WHERE id = (SELECT id FROM `Like` WHERE attractionId = ? LIMIT 1);"
    await conn.query(sql, [id])
    res.status(200).json({ message: "Like removed" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))

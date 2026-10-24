const pool = require("./db");

// async aur await database response ka wait karte hain.
// try mein successful connection aur query ka code hai.
// catch connection ya query fail hone par error dikhata hai.
// result.rows[0] query se aayi pehli row hai.
// finally test ke baad connection pool close karta hai.

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected:", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
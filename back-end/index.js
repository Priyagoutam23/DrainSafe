const express = require("express");
const cors = require("cors");
const reportRoutes = require("./routes/reportRoutes");


// app humara Express application hai. Isse hum routes define karenge aur server start karenge.
const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Allow the server to read JSON request bodies
app.use(express.json());



// Health-check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DrainSafe backend is running",
  });
});

//Ye router ko /api/reports base path deta hai.
app.use("/api/reports", reportRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`DrainSafe backend running at http://localhost:${PORT}`);
});

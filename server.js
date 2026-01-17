require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use(express.json());

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/", serviceRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
// app.use((err, req, res, next) => {
//   console.error("━━━━━━ ERROR HANDLER ━━━━━━");
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({
//     error: {
//       message: err.message || "Internal Server Error",
//       ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
//     },
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

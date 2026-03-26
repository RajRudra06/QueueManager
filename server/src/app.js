const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const env = require("./config/env");

const app = express();

app.use(
  cors({
    origin: env.clientOrigin === "*" ? true : env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

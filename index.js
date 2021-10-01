const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.use(config.get("ROUTES.USER"), require("./routes/UserRoutes"));
app.use(config.get("ROUTES.PROFILES"), require("./routes/ProfileRoutes"));
app.use(config.get("ROUTES.STATS"), require("./routes/StatsRoutes"));

async function start() {
  try {
    await mongoose.connect(config.get("DATABASE.MONGODB"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}
start();

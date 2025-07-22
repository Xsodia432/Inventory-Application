const router = require("./routes/routes");
const express = require("express");
const app = express();
const path = require("node:path");

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express Host Listening ${PORT}`));

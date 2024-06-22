const express = require("express");
const { connectMongoDb } = require("./connection.js");

//Model Imports
const { URL } = require("./models/urls.js");

// Router Imports
const urlRouter = require("./routes/urls.js");
const userRouter = require("./routes/user.js");
const staticRouter = require("./routes/staticRoutes.js");

//MiddleWare Imports
const cookieParser = require("cookie-parser");
const { AuthenticatedLoginOnly, checkAuth } = require("./middlewares/auth.js");

connectMongoDb("mongodb://127.0.0.1:27017/url-compression");
const app = express();
const PORT = 8000;

// views config
app.set("view engine", "ejs");
app.set("views", "./views/");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/", checkAuth, staticRouter);
app.use("/user", userRouter);
app.use("/api/url", AuthenticatedLoginOnly, urlRouter);
app.route("/:shortUrl").get(async (req, res) => {
  const url = req.params.shortUrl;
  if (!url) {
    return res.status(400).json({
      status: "failed",
      msg: "url is required",
    });
  }
  try {
    const originalUrl = await URL.findOneAndUpdate(
      {
        shortUrl: url,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
    );
    if (!originalUrl) {
      return res.status(400).json({
        status: "failed",
        msg: "invalid url",
      });
    }
    console.log("Success");
    console.log(originalUrl);
    res.redirect(originalUrl.url);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: failed,
      msg: "something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server Started");
});

const express = require("express");
const { connectMongoDb } = require("./connection.js");
const urlRouter = require("./routes/urls.js");
const staticRouter = require("./routes/staticRoutes.js");
const { URL } = require("./models/urls.js");

connectMongoDb("mongodb://127.0.0.1:27017/url-compression");

const app = express();
const PORT = 8000;

// views config
app.set("view engine", "ejs");
app.set("views", "./views/");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", staticRouter);
app.use("/api/url", urlRouter);
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

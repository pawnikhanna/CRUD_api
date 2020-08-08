const courseRoutes = require("./courses");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome");
  });

  courseRoutes(app, fs);
};

module.exports = appRouter;
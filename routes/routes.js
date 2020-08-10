const courseRoutes = require("./courses");
const studentRoutes = require("./students");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome");
  });

  courseRoutes(app, fs);
  studentRoutes(app, fs);
};

module.exports = appRouter;

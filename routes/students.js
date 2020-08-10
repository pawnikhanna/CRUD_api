const studentRoutes = (app, fs) => {

    const studentPath = './data/students.json';

    app.get("/students", (req, res) => {
        let students = JSON.parse(fs.readFileSync(studentPath));
        res.send({ students });
      });

    app.get("/students/:id", (req, res) => {
        let students = JSON.parse(fs.readFileSync(studentPath));
        let student = students.find((student) => {
          return student.id == req.params.id;
        });
        if (!student) return res.status(400).json({error: `No student found with ID ${req.params.id}`});
        res.send({ student });
    });

    app.post("/students", (req, res) => {
        let name = req.body.name;
        let description = req.body.description;
        if (!name || !description) {
          return res.status(400).json({ error: "Unidentified" });
        }
        let data = JSON.parse(fs.readFileSync(studentPath));
        data.push({ id: data.length + 1, name, description });
        jsonData = JSON.stringify(data, null, 2);
        fs.writeFile(studentPath, jsonData, "utf8", () => {
        res.json({ success: true });
        });
    });
};

module.exports = studentRoutes;

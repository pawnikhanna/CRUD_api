const courseRoutes = (app, fs) => {

    const coursePath = './data/courses.json';
    const studentPath = './data/students.json';

    app.get("/courses", (req, res) => {
        let courses = JSON.parse(fs.readFileSync(coursePath));
        res.send({ courses });
      });

    app.get("/courses/:id", (req, res) => {
        let courses = JSON.parse(fs.readFileSync(coursePath));
        let course = courses.find((course) => {
          return course.id == req.params.id;
        });
        if (!course) return res.status(400).json({error: `No course available with ID ${req.params.id}`});
        res.send({ course });
    });

    app.post("/courses", (req, res) => {
        let name = req.body.name;
        let description = req.body.description;
        let slots = req.body.slots;

        if (!name || !slots ||!description ) {
          return res.status(400).json({ error: "Unidentified" });
        }
        let data = JSON.parse(fs.readFileSync(coursePath));

        data.push({ id: data.length + 1, name, description, slots });
        fs.writeFile(coursePath, JSON.stringify(courses, null, 2) , "utf8", () => {
        res.json({ success: true });
        });
    });

    app.post("/courses/:id/enroll", (req, res) => {
        const courseId = req.params.id;
        const studentId = req.body.studentId;
        let courses = JSON.parse(fs.readFileSync(coursePath, "utf8"));
        let students = JSON.parse(fs.readFileSync(studentPath, "utf8"));
     
        const course = courses.find((course) => {
          return course.id === parseInt(courseId);
        });
        const student = students.find((student) => {
          return student.id === parseInt(studentId);
        });
        if (!course || !student) {
          return res.status(400).json({ error: `No such course or student exist` });
        }

        if(course.slots > 0){
          course.enrolledStudents.push({ 
            id: student.id,
            name: student.name
          });
          course.slots -=1;
        }
        else {
          return res.json({ success: false, msg: "No slots available"});
        }

        fs.writeFile(coursePath, JSON.stringify(courses, null, 2), "utf8", () => {
          res.json({ success: true });
        });
      });

    app.put("/courses/:id/deregister", (req, res) => {
        const courseId = req.params.id;
        const studentId = req.body.studentId;
        let courses = JSON.parse(fs.readFileSync(coursePath, "utf8"));
        let students = JSON.parse(fs.readFileSync(studentPath, "utf8"));

        const course = courses.find((course) => {
          return course.id === parseInt(courseId);
        });

        if (!course) {
          return res.status(400).json({ error: `No such course with id ${courseId} found`});
        }

        course.slots +=1;
        let enrolledStudents = course.enrolledStudents;
    
        const studentAvailable = enrolledStudents.find((student) => {
          return student.id === parseInt(studentId);
        });
        if (!studentAvailable) {
          return res.json({success: false, msg: `No such student with id ${studentId}`});
        }
  
        let newEnrolledStudents = enrolledStudents.filter((student) => {
          return student.id !== parseInt(studentId);
        });
        courses.data[courseId - 1].enrolledStudents = newEnrolledStudents;
        fs.writeFile(coursePath, JSON.stringify(courses, null, 2) , "utf8", () => {
          res.json({ success: true });
        });
    });
};

module.exports = courseRoutes;

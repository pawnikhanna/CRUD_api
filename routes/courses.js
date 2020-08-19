const express = require('express');
const fs = require('fs');
const app = express.Router();
const coursePath = './data/courses.json';
const studentPath = './data/students.json';
const auth = require('./../middleware/verify');

app.get("/", (req, res) => {
    let courses = JSON.parse(fs.readFileSync(coursePath));
    res.send({ courses });
});

app.get("/:id", (req, res) => {
    let courses = JSON.parse(fs.readFileSync(coursePath));
    let course = courses.find((course) => {
      return course.id == req.params.id;
    });
    if (!course) return res.status(400).json({error: `No course available with ID ${req.params.id}`});
    res.send({ course });
});

app.post("/", (req, res) => {
    let name = req.body.name;
    let slots = req.body.slots;
    let enrolledStudents = req.body.enrolledStudents;

    if (!name || !slots || !enrolledStudents) {
      return res.status(400).json({ error: "Unidentified" });
    }
    let data = JSON.parse(fs.readFileSync(coursePath));

    if(data.slots > 0){
      data.push({ id: data.length + 1, name, slots, enrolledStudents });
    }
    else{
      return res.status(400).json({ error: `Slots cannot be negative` });
    }
      
    fs.writeFile(coursePath, JSON.stringify(data, null, 2) , "utf8", () => {
    res.json({ success: true });
    });
});

app.post("/:id/enroll", auth, (req, res) => {
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

app.put("/:id/deregister", auth, (req, res) => {
  const courseId = req.params.id;
  const studentId = req.body.studentId;
  let courses = JSON.parse(fs.readFileSync(coursePath, "utf8"));
  
  const course = courses.find((course) => {
    return course.id === parseInt(courseId);
  });
  if (!course) {
    return res.status(400).json({ error: `No course with id ${courseId} exist` });
  }
  let enrolledStudents = course.enrolledStudents;
  
  const found = enrolledStudents.some((student) => {
    return student.id === parseInt(studentId);
  });
  if (!found) {
    return res.status(400).json({ error: `No student with id ${studentId} enrolled.` });
  }

  let newEnrolledStudents = enrolledStudents.filter((student) => {
    return student.id !== parseInt(studentId);
  });
  course.enrolledStudents = newEnrolledStudents;
  fs.writeFile(coursePath, JSON.stringify(courses, null, 2) , "utf8", () => {
    res.json({ success: true });
  });
});
module.exports = app;

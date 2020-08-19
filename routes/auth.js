const express = require('express');
const app = express.Router();
const bcrypt  = require('bcrypt');
const {to} = require('await-to-js');
const jwt = require('jsonwebtoken');
const fs = require('fs')

var path = 'data/auth.json';

let salt = 'mysalt';
const generateToken = (password, salt) => {

    let token = jwt.sign( password , salt);
    return token;
}


const passwordHash = async (password) => {
    const saltRounds = 12;
    const [err, passwordHash] = await to(bcrypt.hash(password, saltRounds));
    if (err) {
        return res.send('Error while generating password hash')
    }
    return passwordHash;
};

app.post('/signup', async function (req, res) {
    const {email, password} = req.body;
    const name = req.body.name;
    let data = JSON.parse(fs.readFileSync(path, "utf8"));
    let students = JSON.parse(fs.readFileSync('data/students.json', "utf8"));
    
    let encryptedPassword = await  passwordHash(password);
    data.push({
        email,
        name,  
        encryptedPassword
    });
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    res.json({
        "msg": "Sign up successful"
    });

    students.push({
        id: students.length + 1,
        name
    });
    fs.writeFileSync('data/students.json', JSON.stringify(students, null, 2));
});

app.post('/login', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let err;
    let isValid;

    let students = JSON.parse(fs.readFileSync(path, "utf8"));
    const student = students.find((student) => {
        return student.email == email;
    });
    
    [err, isValid] = await to(
        bcrypt.compare(password, student.encryptedPassword )
    );
    if(!isValid){
        return res.status(400).json({ "error": "Incorrect Password"});
    }
    else{
        return res.json({
            token: generateToken(student, salt)
        }) 
    }

});
module.exports = app;

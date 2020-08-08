const courseRoutes = (app, fs) => {

    const dataPath = './data/courses.json';

    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    app.get('/courses', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    app.post('/courses', (req, res) => {

        readFile(data => {
            const newCourseId = Object.keys(data).length + 1;
            data[newCourseId.toString()] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new course added');
            });
        },
            true);
    });

    app.put('/courses/:id', (req, res) => {

        readFile(data => {

            const courseId = req.params["id"];
            data[courseId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`courses id:${courseId} updated`);
            });
        },
            true);
    });


    app.delete('/courses/:id', (req, res) => {

        readFile(data => {
            const courseId = req.params["id"];
            delete data[courseId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`courses id:${courseId} removed`);
            });
        },
            true);
    });
};

module.exports = courseRoutes;
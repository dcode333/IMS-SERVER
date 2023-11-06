const express = require('express');
const route = express.Router();
const { body, validationResult, param } = require('express-validator');
const Student = require('../../schemas/Student');
const Course = require('../../schemas/Course');
const sendMail = require('../../utils/sendMail');
const { generatePassword } = require('../../utils/helpers');

// Validation middleware for the assignment

const validateObjectId = param('id').isMongoId();
//Registering a user POST /api/auth/register :No login required
route.post(
    "/register",
    [
        body("email").isEmail(),
        body("firstname").exists(),
        body("lastname").exists(),
        body("type").exists(),
        body("beltNo").exists(),
        body("registrationDate").exists(),
        body("dob").exists(),
        body("gender").exists().isIn(['Male', 'Female', 'Other']),
        body("contactNo").exists(),
        body("homeNo").exists(),
        body("address").exists(),
        body("courseCode").exists(),
    ],
    async (req, res) => {
        const password = 'ST' + generatePassword();
        const {
            email,
            firstname,
            lastname,
            type,
            beltNo,
            registrationDate,
            dob,
            gender,
            contactNo,
            homeNo,
            address,
            courseCode } = req.body

        //express-validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const User = type === "teacher" ? Teacher : Student;
        // Checking for a duplicate email
        User.findOne({ email, type }, (error, docs) => {
            if (error) res.status(500).send({ success: false, error });
            if (docs)
                res.status(500).json({ success: false, error: "Email already exists" });
            //creating a user after validation and encrypting password
            else {
                User.create({
                    firstname,
                    email,
                    type,
                    lastname,
                    beltNo,
                    registrationDate,
                    homeNo,
                    contactNo,
                    address,
                    courseCode,
                    dob,
                    gender,
                    password
                }).then((user) => {
                    //data that will be encapsulated in the jwt token

                    sendMail(email, password)
                        .then(result => {
                            console.log(result);
                            res.status(200).send({
                                success: true, data: user
                            });
                        })
                        .catch(error => {
                            res.status(500).send({
                                success: false, error
                            });
                        });


                }).catch((err) => {
                    res.status(500).send({ success: false, error: err });
                });
            }
        });
    }
);


route.get('/students/:id', validateObjectId, async (req, res) => {

    const studentId = req.params.id;

    try {
        const student = await Student.findById(studentId).select('-password');

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

route.get('/students', async (req, res) => {
    try {
        const students = await Student.find().select('-password'); // Exclude the 'password' field

        res.status(200).json({ success: true, data: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


route.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        // Find the student by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, data: 'Student not found' });
        }

        // Delete the student
        await student.remove();

        res.status(200).json({ success: true, data: 'Student deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


route.post("/edit/:id",
    [
        body("email").isEmail(),
        body("firstname").exists(),
        body("lastname").exists(),
        body("beltNo").exists(),
        body("registrationDate").exists(),
        body("contactNo").exists(),
        body("courseCode").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const studentId = req.params.id;
        const updateData = req.body; // Updated attributes

        try {
            // Find the student by ID
            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({ success: false, error: 'Student not found' });
            }

            // Update only the specified attributes
            student.email = updateData.email;
            student.firstname = updateData.firstname;
            student.lastname = updateData.lastname;
            student.beltNo = updateData.beltNo;
            student.registrationDate = updateData.registrationDate;
            student.contactNo = updateData.contactNo;
            student.courseCode = updateData.courseCode;

            // Save the updated student
            await student.save();

            res.status(200).json({ success: true, message: 'Student attributes updated', data: student });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

    }
);





module.exports = route;




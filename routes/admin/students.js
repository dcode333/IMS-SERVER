const express = require('express');
const route = express.Router();
const { body, validationResult, param } = require('express-validator');
const Course = require('../../schemas/Course');
const sendMail = require('../../utils/sendMail');
const { generatePassword } = require('../../utils/helpers');
const Attendance = require('../../schemas/Attendance')
const Student = require('../../schemas/Student');
const Teacher = require('../../schemas/Teacher');

// Validation middleware for the assignment

const validateObjectId = param('id').isMongoId();
//Registering a user POST /api/auth/register :No login required
route.post(
    "/register",
    [
        body("email").isEmail(),
        body("firstname").exists(),
        body("lastname").exists(),
        body("type").exists().isIn(["student"]),
        body("beltNo").exists(),
        body("registrationDate").exists(),
        body("dob").exists(),
        body("gender").exists().isIn(['Male', 'Female', 'Other']),
        body("contactNo").exists(),
        body("homeNo").exists(),
        body("address").exists(),
        body("courseId").isMongoId().exists(),
        body("teacherId").isMongoId().exists(),
        body("picture").exists(),
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
            picture,
            contactNo,
            homeNo,
            address,
            courseId,
            teacherId } = req.body

        //express-validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const User = type === "teacher" ? Teacher : Student;
        // Checking for a duplicate email
        User.findOne({ email, type }, (error, docs) => {
            if (error) return res.status(401).send({ success: false, error });
            if (docs) return res.status(401).json({ success: false, error: "Email already exists" });
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
                    courseId,
                    teacherId,
                    dob,
                    gender,
                    password,
                    picture
                }).then(async (user) => {

                    try {
                        const result = await Attendance.findOneAndUpdate(
                            { courseId: courseId, teacherId: teacherId },
                            {
                                $addToSet: {
                                    students: {
                                        studentId: user._id,
                                        attendance: [], // You can set the initial attendance status
                                    },
                                },
                            },
                            { new: true, upsert: true }
                        );

                        console.log("Stdudent Added to Attendance", result)
                    }
                    catch (e) { console.log(e); }


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
        const students = await Student.find().select('-password').populate('courseId');


        res.status(200).json({ success: true, data: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


route.get('/students-status', async (req, res) => {
    let studentStatus = []
    try {
        const students = await Student.find().select('-password'); // Exclude the 'password' field

        for (const student of students) {
            const course = await Course.findById(student.courseId);
            console.log("s", student, "c", course)
            let currentStatus = ''
            let passfail = ''
            const duration = course?.duration;

            if (new Date(student.registrationDate) + duration >= Date.now()) {
                currentStatus = "Completed";
                passfail = "Pass";
            } else {
                currentStatus = "In Progress";
                passfail = "Pending";
            }

            studentStatus.push({
                studentName: student.firstname + " " + student.lastname,
                courseName: course.name ? course.name : 'N/A',
                durationStatus: currentStatus,
                status: passfail,
                beltNo: student.beltNo,
            })

        }
        res.status(200).json({ success: true, data: studentStatus });
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
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const studentId = req.params.id;
        const {
            email,
            firstname,
            lastname,
            beltNo,
            registrationDate,
            contactNo,
        } = req.body

        try {
            // Find the student by ID
            const student = await Student.findByIdAndUpdate(studentId, {
                email,
                firstname,
                lastname,
                beltNo,
                registrationDate,
                contactNo,
            }, { new: true });

            if (!student) {
                return res.status(404).json({ success: false, error: 'Student not found' });
            }

            res.status(200).json({ success: true, message: 'Student attributes updated', data: student });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

    }
);





module.exports = route;




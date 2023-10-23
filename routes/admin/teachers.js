const express = require('express');
const route = express.Router();
const { body, validationResult, param } = require('express-validator');
const Teacher = require('../../schemas/Teacher');


// Validation middleware for the assignment

const validateObjectId = param('id').isMongoId();
//Registering a user POST /api/auth/register :No login required
route.post(
    "/register",
    [
        body("email").isEmail(),
        body("password", "must be min 5 chars").isLength({ min: 5 }),
        body("firstname").exists(),
        body("lastname").exists(),
        body("type").exists(),
        body("beltNo").exists(),
        body("joiningDate").exists(),
        body("dob").exists(),
        body("gender").exists().isIn(['Male', 'Female', 'Other']),
        body("contactNo").exists(),
        body("homeNo").exists(),
        body("address").exists(),
        body("courseCode").exists(),
        body("designation").exists(),
    ],
    async (req, res) => {
        const { email,
            password,
            firstname,
            lastname,
            type,
            beltNo,
            joiningDate,
            designation,
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

        // Checking for a duplicate email
        Teacher.findOne({ email, type }, (error, docs) => {
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
                    password,
                    designation,
                    joiningDate
                }).then((user) => {
                    //data that will be encapsulated in the jwt token
                    res.status(200).send({
                        success: true, data: user
                    });
                }).catch((err) => {
                    res.status(500).send({ success: false, error: err });
                });
            }
        });
    }
);


route.get('/teachers/:id', validateObjectId, async (req, res) => {

    const teacherId = req.params.id;

    try {
        const teacher = await Teacher.findById(teacherId).select('-password');

        if (!teacher) {
            return res.status(404).json({ success: false, error: 'Teacher not found' });
        }

        res.status(200).json({ success: true, data: teacher });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

route.get('/teachers', async (req, res) => {
    try {
        const teacher = await Teacher.find().select('-password'); // Exclude the 'password' field

        res.status(200).json({ success: true, data: teacher });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

route.delete('/teachers/:id', async (req, res) => {
    const teacherId = req.params.id;

    try {
        // Find the student by ID
        const teacher = await Teacher.findById();

        if (!teacher) {
            return res.status(404).json({ success: false, data: 'teacher not found' });
        }

        // Delete the student
        await teacher.remove();

        res.status(200).json({ success: true, data: 'teacher deleted' });
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
        body("joiningDate").exists(),
        body("contactNo").exists(),
        body("courseCode").exists(),
        body("designation").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array() });
        }

        const teacherId = req.params.id;
        const updateData = req.body; // Updated attributes

        try {
            // Find the student by ID
            const teacher = await Teacher.findById(teacherId);

            if (!teacher) {
                return res.status(404).json({ success: false, error: 'teacher not found' });
            }

            // Update only the specified attributes
            teacher.email = updateData.email;
            teacher.firstname = updateData.firstname;
            teacher.lastname = updateData.lastname;
            teacher.beltNo = updateData.beltNo;
            teacher.joiningDate = updateData.joiningDate;
            teacher.contactNo = updateData.contactNo;
            teacher.courseCode = updateData.courseCode;
            teacher.designation = updateData.designation;

            // Save the updated student
            await teacher.save();

            res.status(200).json({ success: true, message: 'teacher attributes updated', data: teacher });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

    }
);





module.exports = route;




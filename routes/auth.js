require("dotenv").config();
const express = require("express");
const Teacher = require("../schemas/Teacher");
const Student = require("../schemas/Student");
const { body, validationResult } = require("express-validator");
const authenticateRequest = require("../middlewares/authRequest");
const sendMail = require("../middlewares/mailsender");
const router = express.Router();


router.post('/sendmail', sendMail, async (req, res) => {
  const { email, pincode, expiry } = req.body;
  res.status(200).json({ success: true, data: { pincode, expiry } });
});

router.post(
  "/changepassword",
  [
    body("email").exists().isEmail(),
    body("password", "must be min 5 chars").isLength({ min: 5 }),
    body("type").isIn(['teacher', 'student']).exists()
  ],
  async (req, res) => {
    const { password, email, type } = req.body;

    //express-validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    try {
      const User = type === "teacher" ? Teacher : Student;
      const findmatching = await User.findOne({ email, type });
      if (!findmatching) return res.status(400).json({ success: false, error: 'No matching email found' });

      const filter = { email, type };
      const update = { password };

      const doc = await User.findOneAndUpdate(filter, update, { new: true }).select("-password");
      if (!doc) return res.status(500).json({ success: false, error: 'Server error' });
      res.status(200).json({ success: true, data: doc });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server error' });
    }

  })

router.post(
  "/updateuser",
  [
    body("name").exists(),
    body("id").exists(),
  ],
  async (req, res) => {
    const {
      name,
      id } = req.body;

    //express-validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const filter = { _id: id };
    const update = {
      name,
    };

    const user = await User.findOneAndUpdate(filter, update, { new: true });
    if (!user) return res.status(500).json({ success: false, error: 'Server error' });

    const data = {
      id: user._id,
      name: user.name,
      email: user.email,
    }


    res.status(200).json({ success: true, data });

  })


//Logging the user POST /api/auth/login :No login required
router.post(
  "/login",
  [
    body("email").isEmail().exists(),
    body("password", "must be min 5 chars").isLength({ min: 5 }),
    body("type").isIn(['teacher', 'student', 'admin', 'iadmin']).exists()
  ],
  (req, res) => {
    const { email, password, type } = req.body;
    //express-validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const User = type === "teacher" ? Teacher : Student;
    //checking if the user exists or not based on email
    User.findOne({ email, type }, (error, user) => {
      if (error) res.status(500).send({ success: false, error });
      if (user) {
        console.log(user)

        res.status(200).send({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } else res.status(400).send({ success: false, message: "User not found" });
    });
  }
);

//Getting the user Info GET /api/auth/getuser : login (Tokened) required
router.get("/getstudent", authenticateRequest, (req, res) => {
  Student.findById(req.user.id, (error, user) => {
    if (error) res.status(500).send({ success: false, error });
    res.status(200).send({ success: true, user });
  }).populate('Course').select("-password");
});

router.get("/getteacher", authenticateRequest, (req, res) => {
  Teacher.findById(req.user.id, (error, user) => {
    if (error) res.status(500).send({ success: false, error });
    res.status(200).send({ success: true, user });
  }).select("-password");
});


module.exports = router;


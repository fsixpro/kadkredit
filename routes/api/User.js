const router = require('express').Router();
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const rn = require('random-number');
const mailer = require('../../mailer/mailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const utils = require('../../util/Utility');
const Util = new utils();
const auth = require('../../middleware/auth');
const axios = require('axios');
//@route    api/user/signup
//@desc     Register a user
//@access   public
router.post('/signup', async (req, res) => {
  let valid = Util.signupCheck(req.body);
  if (valid !== true) {
    console.log(valid);
    return res.status(200).json(valid);
  }
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      dateOfBirth,
      phone,
      gender,
    } = req.body;

    let user = await User.findOne({ phone });

    if (user) {
      if (user.status != 0) {
        return res
          .status(200)
          .json({ status: false, msg: 'Phone already taken' });
      }
    }

    user = await User.findOne({ email });

    if (user) {
      if (user.status != 0) {
        return res
          .status(200)
          .json({ status: false, msg: 'Email already taken', data: {} });
      }
    }

    if (user) {
      let otp = await Otp.findOne({ user: user.id });
      try {
        const mailOption = {
          from: 'Kadkredit Finance',
          to: user.email,
          subject: 'one-time-password from kadkredit',
          html: `<p> use ${otp.otp} to confirm your email`,
        };
        await mailer.sendMail(mailOption);

        return res.status(200).json({
          status: true,
          msg: 'Otp has been send to your mailing address.',
          data: {},
        });
      } catch (ex) {
        console.log('Exception', ex);
        return res.status(200).json({
          status: true,
          msg: 'Something went wrong, pls try again after a while.',
          data: {},
        });
      }
    } else {
      var dob = new Date(dateOfBirth);
      const newUser = new User({
        firstName,
        lastName,
        password,
        email,
        dob,
        phone,
        gender,
        status: 0,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      const savedUser = await newUser.save();
      const otp = new Otp({
        user: savedUser.id,
        email,
        otp: rn({
          min: 100000,
          max: 999999,
          integer: true,
        }),
      });

      const savedOtp = await otp.save();
      const mailOption = {
        from: 'Kadkredit Finance',
        to: savedUser.email,
        subject: 'one-time-password from kadkredit',
        html: `<p> use ${savedOtp.otp} to confirm your email`,
      };
      await mailer.sendMail(mailOption);
      return res.json({
        status: true,
        msg: 'an otp has been sent to your mailing address..',
        data: {},
      });
    }
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

//@route    api/user/login
//@desc     Login a user
//@access   public
router.post('/signin', async (req, res) => {
  let valid = Util.signinCheck(req.body);
  if (valid !== true) {
    return res.status(400).json(valid);
    //return Util.failureResponse0(res, 'One or more field is missing.', {});
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //check if user does not exist
    if (!user) {
      return Util.failureResponse0(res, 'invalid login credential.', {});
    }
    //check user status
    if (user.status == 0) {
      return Util.failureResponse0(
        res,
        'email not confirm, please confirm your email.',
        {}
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    //check if password does not match

    if (!passwordMatch) {
      return Util.failureResponse0(res, 'invalid login credential.', {});
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({
      status: true,
      msg: 'success',
      data: {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

router.all('/', auth, async (req, res) => {
  const hi = { salutation: 'Hi', data: 'Welcome to kadkredit test endpoint' };
  res.json(hi);
});

module.exports = router;

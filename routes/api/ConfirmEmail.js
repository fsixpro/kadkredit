const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const utils = require('../../util/Utility');
const Util = new utils();

router.post('', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const otp = await Otp.findOne({ otp: req.body.otp, email: req.body.email });

    if (otp == undefined || otp == null || otp == '')
      return res.json({
        status: true,
        msg: 'Invalid Otp Supplied.',
        data: {},
      });

    if (user.status != 0) {
      return res.json({
        status: true,
        msg: 'email has already been confirmed',
        data: {},
      });
    }

    user.status = 1;
    await user.save();
    return Util.successResponse(res);
  } catch (exc) {
    console.log(exc);
  }
});
module.exports = router;

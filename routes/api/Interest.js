const express = require('express');
const router = express.Router();
const Interest = require('../../models/Interest');
const utils = require('../../util/Utility');
const Util = new utils();

router.post('/', async (req, res) => {
  let valid = Util.interestCheck(req.body);
  if (valid != true) {
    return res.status(400).json({ data: valid });
  }
  try {
    const { range, rate } = req.body;
    const newInterest = new Interest({
      range,
      rate,
    });
    const savedInterest = await newInterest.save();
    return Util.successResponse(res, savedInterest);
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.get('/', async (req, res) => {
  try {
    const interest = await Interest.find();
    return res.json({
      status: true,
      msg: 'success',
      count: interest.length,
      data: interest,
    });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

module.exports = router;

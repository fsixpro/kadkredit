const express = require('express');
const router = express.Router();
const utils = require('../../util/Utility');
const Util = new utils();
const Loan = require('../../models/Loan');
const Interest = require('../../models/Interest');
const auth = require('../../middleware/auth');
const Card = require('../../models/Card');

router.post('/request', auth, async (req, res) => {
  let valid = Util.loanCheck(req.body);
  if (valid != true) {
    return res.status(400).json({ data: valid });
  }

  try {
    const interest = await Interest.findOne({ _id: req.body.int_rate_id });
    const pendingLoan = await Loan.findOne({
      status: 'pending',
      user: req.user.id,
    });
    const card = await Card.find({ user: req.user.id });
    if (card.length < 1) {
      return res.status(400).json({
        status: false,
        msg: 'please add a card before applying for loan',
      });
    }

    if (pendingLoan) {
      return res
        .status(400)
        .json({ status: false, msg: 'you have a pending loan' });
    }

    if (!interest) {
      return res
        .status(404)
        .json({ status: false, msg: 'invalid interest rate' });
    }

    const real_payback_amount =
      req.body.amount + (interest.rate / 100) * req.body.amount;
    if (real_payback_amount != req.body.repay_amount) {
      return res
        .status(404)
        .json({ status: false, msg: 'invalid loan request.' });
    }
    let repay_date = new Date(req.body.repay_date);
    const newLoan = new Loan({
      status: 'pending',
      user: req.user.id,
      amount: req.body.amount,
      repay_amount: real_payback_amount,
      repay_date: repay_date,
    });
    const savedLoan = await newLoan.save();
    return Util.successResponse(res, {
      id: savedLoan.id,
      status: savedLoan.status,
      amount: savedLoan.amount,
      repay_amount: savedLoan.repay_amount,
      repay_date: savedLoan.repay_date,
    });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const loan = await Loan.find({ user: req.user.id });
    if (loan.length < 1) {
      return res.json({ status: true, msg: 'you have no loan', data: {} });
    }
    return res
      .status(200)
      .json({ status: true, msg: 'success', count: loan.length, data: loan });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

module.exports = router;

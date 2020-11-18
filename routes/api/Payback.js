const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Loan = require('../../models/Loan');
const Card = require('../../models/Card');
const User = require('../../models/User');
const utils = require('../../util/Utility');
const Util = new utils();
const Api = require('../../network/ApiCalls');
const ApiCalls = new Api();

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const loan = await Loan.findOne({
      user: req.user.id,
      _id: req.body.loanId,
    });
    if (
      loan.status == 'active' ||
      loan.status == 'due' ||
      loan.status == 'pending'
    ) {
      const card = await Card.findOne({
        user: req.user.id,
        _id: req.body.cardId,
      });
      const params = {
        email: user.email,
        amount: loan.repay_amount * 100,
        authorization_code: card.authCode,
      };
      await ApiCalls.payBack(params, async (resp) => {
        loan.status = 'paid';
        await loan.save();
        return res.json({
          status: true,
          msg: 'success',
          data: {
            id: loan.id,
            status: loan.status,
            amount: loan.amount,
            repay_amount: loan.repay_amount,
          },
        });
      });
    }
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

module.exports = router;

const router = require('express').Router();
const auth = require('../../middleware/auth');
const axios = require('axios');
const utils = require('../../util/Utility');
const Util = new utils();
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const Card = require('../../models/Card');

const Api = require('../../network/ApiCalls');
const ApiCalls = new Api();

//@route        transaction/init
//@desc         generate and returns a reference code and amount
//@access       private
router.get('/init', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const param = {
      reference: Util.genref(),
      amount: 100000,
      email: user.email,
    };

    ApiCalls.initializeTransaction(param, async (resp) => {
      if (resp.status) {
        try {
          const newTransaction = new Transaction({
            user: req.user.id,
            refCode: param.reference,
            amount: 1000,
            satus: 1,
          });

          await newTransaction.save();

          data = {
            authorization_url: resp.data.authorization_url,
            reference: resp.data.reference,
            amount: newTransaction.amount,
            access_code: resp.data.access_code,
          };

          return Util.successResponse(res, data);
        } catch (exc) {
          console.log('new transaction error', exc);
          return Util.failureResponse(res, {});
        }
      } else {
        console.log(resp);
        return Util.failureResponse(res, {});
      }
    });
  } catch (exc) {
    console.log('init add card error', exc);
    return Util.failureResponse(res, {});
  }
});

//@route        transaction/confirm
//@desc         verify a transaction
//@access       private
router.post('/confirm/', auth, async (req, res) => {
  try {
    ApiCalls.verifyTransaction(req.body.reference, async (resp) => {
      if (resp.status == true) {
        const newCard = new Card({
          user: req.user.id,
          lastFour: resp.data.last4,
          type: resp.data.card_type,
          authCode: resp.data.authorization_code,
          bin: resp.data.bin,
          bank: resp.data.bank,
          reusable: resp.data.reusable,
          signature: resp.data.signature,
          brand: resp.data.brand,
          exp_year: resp.data.exp_year,
        });

        await newCard.save();
        return Util.successResponse(res, resp.data);
      } else {
        console.log('erro', resp);
        return Util.failureResponse(res, {});
      }
    });
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json({
      status: true,
      msg: 'success',
      count: transactions.length,
      data: transactions,
    });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

module.exports = router;

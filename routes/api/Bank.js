const router = require('express').Router();
const auth = require('../../middleware/auth');
const Bank = require('../../models/Bank');
const Api = require('../../network/ApiCalls');
const ApiCalls = new Api();
const utils = require('../../util/Utility');
const Util = new utils();

router.get('/banks', auth, async (req, res) => {
  try {
    ApiCalls.getBanks((resp) => {
      if (resp.status) return Util.successResponse(res, resp.data);

      return Util.failureResponse(res, {});
    });
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.post('/resolve', auth, async (req, res) => {
  try {
    const accNum = req.body.accNum;
    const bankCode = req.body.bankCode;

    if (accNum == null || accNum == undefined) {
      return Util.failureResponse0(
        res,
        'Invalid Account Number @key accNum',
        {}
      );
    }

    if (bankCode == null || bankCode == undefined) {
      return Util.failureResponse0(res, 'Invalid Bank Code @key bankCode', {});
    }

    ApiCalls.resolveAccountName(accNum, bankCode, (resp) => {
      return Util.successResponse(res, resp.data);
    });
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const bankObj = {
      user: req.user.id,
      accountNumber: req.body.accountNumber,
      bankCode: req.body.bankCode,
      bankId: req.body.bankId,
      accountName: req.body.accountName,
    };

    const newBank = new Bank(bankObj);

    await newBank.save();

    return Util.successResponse(res, newBank);
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.get('/get', auth, async (req, res) => {
  try {
    const bank = await Bank.find({ user: req.user.id });
    if (bank) {
      const data = bank;
      return res.status(200).json({ msg: 'success', count: bank.length, data });
    }
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    await Bank.deleteOne({ _id: req.body.bankId, user: req.user.id });
    return res.status(200).json({ msg: 'success', data: {} });
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});
module.exports = router;

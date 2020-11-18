const router = require('express').Router();
const auth = require('../../middleware/auth');
const Card = require('../../models/Card');
const Loan = require('../../models/Loan');
const utils = require('../../util/Utility');
const Util = new utils();
router.get('/get', auth, async (req, res) => {
  try {
    const card = await Card.find({ user: req.user.id });
    if (card.length < 1) {
      return res.status(200).json({
        msg: 'you have no card associated with your account',
        count: card.length,
        data: {},
      });
    }
    const data = card;
    return res.status(200).json({ msg: 'success', count: card.length, data });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const loan = await Loan.findOne({ user: req.user.id });
    if (loan.status == 'pending') {
      return res.status(400).json({
        status: false,
        msg: 'You cannot delete card with a pending loan',
        data: {},
      });
    }
    await Card.deleteOne({ _id: req.body.cardId, user: req.user.id });
    return res.status(200).json({ msg: 'success', data: {} });
  } catch (exc) {
    console.log(exc);
    return Util.failureResponse(res, {});
  }
});
module.exports = router;

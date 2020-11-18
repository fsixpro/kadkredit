const router = require('express').Router();
const auth = require('../../middleware/auth');
const Bvn = require('../../models/Bvn');
const Api = require('../../network/ApiCalls');
const ApiCalls = new Api();
const utils = require('../../util/Utility');
const Util = new utils();

router.post('/verify', auth, async (req, res) => {
  try {
    const bvn = req.body.bvn;
    const resp = ApiCalls.verifyBvn(bvn, (resp) => {
      return Util.successResponse(res, resp.data);
    });
  } catch (exc) {
    return Util.failureResponse(res, {});
  }
});

module.exports = router;

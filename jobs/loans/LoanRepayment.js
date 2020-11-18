const Loan = require('../../models/Loan');
const Card = require('../../models/Card');
const User = require('../../models/User');

const Api = require('../../network/ApiCalls');
const ApiCalls = new Api();

class LoanRepayment {
  async fetchAllLoansWithStatusPending() {
    try {
      const pendingLoan = await Loan.find({
        status: 'pending',
      });

      pendingLoan.forEach((item) => {
        var date = Date.parse(item.repay_date);
        var now = Date.now();

        if (now >= date) {
          this.chargeUser(item);
        }
      });
    } catch (exception) {
      this.log(exception);
    }
  }

  async chargeUser(loanItem) {
    const userCard = await Card.findOne({
      reusable: 'true',
      user: loanItem.user,
    });

    this.log("YOU'RE ABOUT TO BE CHARGED NIGGA" + userCard);

    if (userCard) {
      const user = await User.findOne({
        _id: loanItem.user,
      });

      if (user) {
        const payload = {
          amount: loanItem.repay_amount,
          email: user.email,
          authorization_code: userCard.authCode,
        };

        ApiCalls.payBack(payload, async (res) => {
          if (res.status) {
            loanItem.status = 'paid';
            await loanItem.save();
          } else {
            //we still gona try chargin you muda fucker
          }
        });
      }
    }
  }

  execute() {
    this.fetchAllLoansWithStatusPending();
  }

  log(res) {
    console.log(res);
  }
}
module.exports = LoanRepayment;

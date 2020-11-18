const randomstring = require('randomstring');
class Utility {
  constructor() {
    this.emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]){2,5}$/;
  }
  response(status, msg) {
    return {
      status: status,
      msg: msg,
    };
  }

  signupCheck(req) {
    if (req.email === undefined || req.email === '') {
      return this.response(false, 'email is required');
    }
    if (!this.emailPattern.test(req.email)) {
      return this.response(false, 'please input a valid email');
    }
    if (req.firstName === undefined || req.firstName === '') {
      return this.response(false, 'first name is required');
    }
    if (req.lastName === undefined || req.lastName === '') {
      return this.response(false, 'lastname is required');
    }
    if (req.password === undefined || req.password === '') {
      return this.response(false, 'password is required');
    }
    if (req.phone === undefined || req.phone === '') {
      return this.response(false, 'please input a valid phone number');
    }
    if (req.dateOfBirth === undefined || req.dateOfBirth === '') {
      return this.response(false, 'date of birth is required');
    }
    return true;
  }

  signinCheck(req) {
    if (req.email === undefined || req.email === '') {
      return this.response(false, 'email is required');
    }
    if (!this.emailPattern.test(req.email)) {
      return this.response(false, 'please input a valid email');
    }
    if (req.password === undefined || req.password === '') {
      return this.response(false, 'password is required');
    }

    return true;
  }
  genref() {
    let string = randomstring.generate(6);
    return `kadref${string}`;
  }

  successResponse(res, data = {}) {
    return res.status(200).json({
      status: true,
      msg: 'Success',
      data: data,
    });
  }

  failureResponse(res, data = {}) {
    return res.status(200).json({
      status: false,
      msg: 'Failure',
      data: data,
    });
  }

  failureResponse0(res, msg = 'Failure', data = {}) {
    return res.status(200).json({
      status: false,
      msg: msg,
      data: data,
    });
  }

  interestCheck(req) {
    if (req.range == null || req.range == undefined) {
      return this.response(false, 'please input an interest range');
    }

    if (req.rate == null || req.rate == undefined) {
      return this.response(false, 'please input an interest rate');
    }
    return true;
  }
  loanCheck(req) {
    if (req.amount == null || req.amount == undefined || req.amount == '') {
      return this.response(false, 'please specify a loan amount');
    }

    if (
      req.repay_amount == null ||
      req.repay_amount == undefined ||
      req.repay_amount == ''
    ) {
      return this.response(false, 'please input an amount to repay');
    }
    return true;
  }
}

module.exports = Utility;

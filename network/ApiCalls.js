const Axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co/';
const cred = require('../util/Cred');

class ApiCalls {
  AxiosInstance() {
    let instance = Axios.create({ baseURL: PAYSTACK_BASE_URL });
    instance.defaults.headers.post[
      'Authorization'
    ] = `Bearer ${cred.SECRET_KEY}`;
    instance.defaults.headers.post['Content-Type'] = 'application/json';

    return instance;
  }

  AxiosInstance1() {
    const instance = Axios.create({
      baseURL: PAYSTACK_BASE_URL,
      timeout: 60000,
      headers: { Authorization: `Bearer ${cred.SECRET_KEY}` },
    });

    return instance;
  }

  AxiosInstance2() {
    let instance = Axios.create({ baseURL: PAYSTACK_BASE_URL });
    return instance;
  }

  // initilize transaction
  async initializeTransaction(params, callBack) {
    try {
      const res = await this.AxiosInstance().post(
        'transaction/initialize/',
        params
      );

      if (res.status == 200) {
        callBack(this.successResponse('Success', res.data.data));
      } else if (res.status == 400) {
        callBack(this.failureResponse());
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      console.log('ddd', exc);
      callBack(this.failureResponse());
    }
  }

  //Verify transaction
  async verifyTransaction(params, callBack) {
    try {
      const res = await this.AxiosInstance1().get(
        `transaction/verify/${params}`
      );
      if (res.status == 200) {
        if (res.data.data.status == 'success') {
          callBack(
            this.successResponse('Success', res.data.data.authorization)
          );
        } else {
          callBack(this.failureResponse());
        }
      } else if (res.status == 400) {
        callBack(this.failureResponse());
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      callBack(this.failureResponse());
    }
  }

  async verifyBvn(param, callBack) {
    try {
      const config = {
        headers: {
          Authorization:
            'Bearer sk_test_470e4e1b57ebbcca3f47cfcb218894216fde13d7',
        },
      };
      const res = await Axios.get(
        `https://api.paystack.co/bank/resolve_bvn/${param}`,
        config
      );
      console.log(res);
      if (res.data.status == true) {
        callBack(this.successResponse('success', res.data));
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      callBack(this.failureResponse(), console.log(exc));
    }
  }

  /**
   * Simply calls paystack api to get list of banks
   * @param {Returns the list of banks if successful else return a formated Json Error obj} callBack
   */
  async getBanks(callBack) {
    try {
      const res = await this.AxiosInstance2().get('bank');

      if (res.status == 200) {
        callBack(this.successResponse('Success', res.data.data));
      } else if (res.status == 400) {
        callBack(this.failureResponse());
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      callBack(this.failureResponse());
    }
  }

  /**
   *
   * @param {Account Number to be verified} accNum
   * @param {Bank code matching the bank account as listed on paystack Endpoint @PAYSTACK_BASE_URL/bank} bankCode
   * @param {*} callBack
   */
  async resolveAccountName(accNum, bankCode, callBack) {
    try {
      const res = await this.AxiosInstance1().get(
        `bank/resolve?account_number=${accNum}&bank_code=${bankCode}`
      );

      if (res.status == 200) {
        callBack(this.successResponse('Success', res.data.data));
      } else if (res.status == 400) {
        callBack(this.failureResponse());
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      callBack(this.failureResponse());
    }
  }

  async payBack(params, callBack) {
    try {
      const res = await this.AxiosInstance1().post(
        'transaction/charge_authorization',
        params
      );
      if (res.status == 200) {
        callBack(this.successResponse('success', res.data));
      } else {
        callBack(this.failureResponse());
      }
    } catch (exc) {
      console.log('payback exc', exc);
      callBack(this.failureResponse());
    }
  }

  successResponse(msg = 'Success', data = {}) {
    return {
      status: true,
      msg: msg,
      data: data,
    };
  }

  failureResponse(msg = 'Failure', data = {}) {
    return {
      status: false,
      msg: msg,
      data: data,
    };
  }
}

module.exports = ApiCalls;

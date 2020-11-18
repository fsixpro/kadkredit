var CronJob = require('cron').CronJob;
const LR = require('../jobs/loans/LoanRepayment');
const LoanRepayment = new LR();

function exe()
{
    var job = new CronJob('* * * * * *', function () {
        
        LoanRepayment.execute();

        job.stop();
    
    }, null, true, 'Africa/Lagos');

    job.start();
}

module.exports = exe;
const express = require('express');
const app = express();
const db = require('./Db');

const unitTest = require('./unit_testing/Test');

//init bodyParser middleware
app.use(express.json());

app.all('/', (req, res) => {
  const hi = { salutation: 'Hi', data: 'Welcome to kadkredit test endpoint' };
  res.json(hi);
});

//init user route
app.use('/api/user', require('./routes/api/User'));
//init bvn route
app.use('/api/bvn', require('./routes/api/Bvn'));
//init bank route
app.use('/api/bank', require('./routes/api/Bank'));
//init Transaction route
app.use('/api/transaction', require('./routes/api/Transaction'));
//init card route
app.use('/api/card', require('./routes/api/Card'));
//init interest route
app.use('/api/interest', require('./routes/api/Interest'));
//init loan route
app.use('/api/loan', require('./routes/api/Loan'));
//init payback route
app.use('/api/payback', require('./routes/api/Payback'));
//init confirmEmail route
app.use('/api/confirmemail', require('./routes/api/ConfirmEmail'));
//init connection to database
db();

unitTest();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server started on port ${port}`));

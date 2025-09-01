const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./lib/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/company', require('./routes/company'));

const port = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });

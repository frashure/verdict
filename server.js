const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();

const port = process.env.port || 3232;

app.listen(port, () => {
    console.log(`Verdict app listening on port ${port}`);
});

//
const usersRoutes = require('./routes/userRoutes');
app.use('/users', usersRoutes);
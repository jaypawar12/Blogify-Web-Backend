require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

require("./config/db.config");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/', require('./routes/index'));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Not Started.....");
        return false;
    }
    console.log(`Server is started at.... https://localhost:${PORT}`);

})
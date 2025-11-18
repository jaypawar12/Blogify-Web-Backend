require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

require("./config/db.config");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', require('./routes/index'));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Not Started.....", err);
        return false;
    }
    console.log(`Server is started at.... http://localhost:${PORT}`);

})
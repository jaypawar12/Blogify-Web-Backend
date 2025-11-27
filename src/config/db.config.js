const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB is conncted...");
    })
    .catch(err => {
        console.log("DB is not conncted...", err);
    })
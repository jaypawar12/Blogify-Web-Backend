const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Db is Connected....");

}).catch(err => {
    console.log("Db is not connected....", err);
})
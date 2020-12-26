const mongoose = require('mongoose');

const connectDB = () => {
    const connectDB = mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, () => {
        console.log('connected to db')
    })
}

module.exports = connectDB;
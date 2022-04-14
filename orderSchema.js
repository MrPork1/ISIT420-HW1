const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    StoreID: {
        type: Number,
        required: true
    },
    SalesPersonID: {
        type: Number,
        required: true
    },
    CdID: {
        type: Number,
        required: true
    },
    PricePaid: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Orders", OrderSchema);

//1. Who are the highest grossing sales persons and what store do they work for?
//2. How many CDs were sold in the first 5 hours?
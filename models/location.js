const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const locationSchema = new Schema({
    imageUrl: { type: String }, // leads to URL I think (?)
    title: { type: String }, // "I want to got to..."
    plan: { type: String }, // it's for user to take notes
    location: { type: String }, //?? don't know the relation to the API at this moment, might be an ObjectId?
    comments: [], // have to ask TA for that
    expireDate: {
        type: String,
        default: () => moment().format('MMM Do YY')
    },
    done: { type: Boolean },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
        timestamps: true
    }
)
module.exports = mongoose.model("Location", locationSchema)
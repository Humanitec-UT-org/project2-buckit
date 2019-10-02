const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    experience: { type: Schema.Types.ObjectId, ref: 'Experience' },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);

const mongoose = require("mongoose");

const db_schema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    blogOf: {
        type: mongoose.Types.ObjectId,
        ref: "db_blog"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user_model"
    }
},
{ timestaps: true }
);

const Comment = mongoose.model("comment_db", db_schema);

module.exports = Comment;
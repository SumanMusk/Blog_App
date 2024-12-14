const { Schema, model } = require("mongoose");

const schema = new Schema({
    coverImage: {
        type: String,
        default: "/images/default_blog_cover.jpg"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user_model"
    }
},
{ timestamps: true }
);

const blogdata = model("db_blog", schema);

module.exports = blogdata;
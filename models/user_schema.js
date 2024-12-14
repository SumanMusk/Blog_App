const { mongoose } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createJWToken } = require("../services/jwt_auth");

const schema = mongoose.Schema({
    pfpImage: {
        type: String,
        default: "/images/default_pfp.jpeg"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
},
    { timestamps: true },
    { collection: "userColl" }
);

schema.pre("save", function(next) {
    const user = this;

    const cooking_salt = randomBytes(16).toString();
    const hasedpassword = createHmac("sha256", cooking_salt)
                .update(user.password)
                .digest("hex");

    user.salt = cooking_salt;
    user.password = hasedpassword;

    next();
});

schema.static("chk_password", async function(email, password) {
    const user = await this.findOne({ email: email });
    if(user === null)
        return;

    const new_hassed_password = createHmac("sha256", user.salt)
                                .update(password)
                                .digest("hex");
    
    if(new_hassed_password !== user.password)
        return;

    const token = createJWToken(user);    
    return token;
});

const userdata = mongoose.model("user_model", schema);

module.exports = userdata;
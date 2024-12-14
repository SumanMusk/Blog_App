const express = require("express");
const multer = require("multer");
const userdata = require("../models/user_schema");

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/pfps");
    },
    filename: (req, file, cb) => {
        const extName = file.originalname.split(".").reverse()[0];
        const fileName = `${Date.now()}.${extName}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });


userRouter.get("/signup", (req, res) => {
    res.render("signup");
});

userRouter.post("/signup", upload.single("pfpImage"), async (req, res) => {
    const { name, email, password } = req.body;
    const data = await userdata.find({ email });

    if(data.length !== 0) 
        return res.render("signup", { errMsz: "Account already Exists!" });

    const imageURL = `/uploads/pfps/${req.file.filename}`;
    await userdata.create({ pfpImage: imageURL, name, email, password });

    res.redirect("/login");
});

userRouter.get("/login", (req, res) => {
    const dynamic_redirect_url = req.url;
    res.render("login", { errMsz: true, dynamic_redirect_url });
});

userRouter.post("/login", async (req, res) => {
    const { email, password, dynamic_redirect_url } = req.body;  
    const password_cookie = await userdata.chk_password(email, password);

    if(password_cookie) {
        res.cookie("token", password_cookie);
        const urlParams = new URLSearchParams(dynamic_redirect_url);
        const redirectUrl = urlParams.get('redirect') || '/';

        return res.redirect(redirectUrl);
    }
    
    return res.render("login", { errMsz: false, dynamic_redirect_url });
});

userRouter.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

module.exports = userRouter;
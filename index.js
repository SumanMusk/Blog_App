require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user_routes");
const blogRouter = require("./routes/blog_routes");
const profileRouter = require("./routes/profile_route");
const { validateUserCookie, validateLoggedIn } = require("./middlewares/authentication");
const blogdata = require("./models/blog_schema");

const app = express();
const DB_URL = process.env.DB_URL;
global.PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(validateUserCookie("token"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/", async (req, res) => {
    const user = req.user;
    const allData = await blogdata.find({}).populate("createdBy");
    res.render("home", { user, allData });
});

app.use("/", userRouter);
app.use("/user", validateLoggedIn("token"), profileRouter);
app.use("/blogs", validateLoggedIn("token"), blogRouter);

mongoose.connect(DB_URL)
.then( () => console.log("db connected") )
.catch( () => console.log("db crashed!!!") )

app.listen(PORT, () => {
    console.log("Server Running!");    
});
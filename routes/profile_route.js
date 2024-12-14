const { Router } = require("express");
const blogdata = require("../models/blog_schema");

const router = Router();

router.get("/:id", async (req, res) => {
    const user = req.user;
    const user_blogs = await blogdata.find({ createdBy: user._id });
    
    res.render("profile", { user, user_blogs });
});

module.exports = router;
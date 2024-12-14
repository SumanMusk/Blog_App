const { Router } = require("express");
const multer = require("multer");
const blogdata = require("../models/blog_schema");
const Comment = require("../models/comments");

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/coverImages");
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });


router.get("/add-blog", (req, res) => {  
    const user = req.user;
    res.render("./blog/blog-form", { user });
});

router.post("/add-blog", upload.single("imageTaker"), async (req, res) => {  
    const { userJSON, title, description } = req.body;  
    const user = JSON.parse(userJSON);

    try {
        if(req.file) {
            const imageURL = `/uploads/coverImages/${req.file.filename}`;
            await blogdata.create({ coverImage: imageURL, title, description, createdBy: req.user._id });
        }
        else await blogdata.create({ title, description, createdBy: req.user._id });

        res.redirect("/");     
    } catch (error) {
        res.render("errpage", { user, errMsz: "Error occured while creating blog" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const data = await blogdata.findById(id).populate("createdBy");  
        const allComments = await Comment.find({ blogOf: id }).sort({ createdAt: 1 }).populate("createdBy");  
        
        if(req.query.err)
            return res.render("./blog/blog-post", { user, data, allComments, errMsz: req.query.err });
        else return res.render("./blog/blog-post", { user, data, allComments });
    } catch (error) {
        return res.render("errpage", { user, errMsz: "No such blogs are there!!" });
    }
});

router.post("/:id", async (req, res) => {
    const user_id = req.user._id;
    const blog_id = req.params.id;
    const { comment } = req.body;
    try{
        await Comment.create({ comment, blogOf: blog_id, createdBy: user_id });
        res.redirect(`/blogs/${blog_id}`);
    } catch(error) {
        res.redirect(`/blogs/${blog_id}?err=${encodeURIComponent("Add a comment first!")}`);
    }
});

module.exports = router;
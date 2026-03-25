const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ IMPORTANT

const {
  createPost,
  getPosts,
  likePost,
  commentPost
} = require("../controllers/postController");

// ✅ THIS IS THE MAIN FIX
router.post("/", auth, upload.single("image"), createPost);
router.post("/", authMiddleware, upload.single("image"), createPost);

router.get("/", getPosts);
router.put("/like/:id", auth, likePost);
router.put("/comment/:id", auth, commentPost);

module.exports = router;
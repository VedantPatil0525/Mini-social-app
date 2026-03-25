const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    // ✅ ADD HERE (VERY FIRST LINES)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const text = req.body?.text || "";

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ msg: "Post cannot be empty" });
    }

    const post = new Post({
      userId: req.user.id,
      username: req.user.username,
      text,
      image: imageUrl
    });

    await post.save();
    res.json(post);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post.likes.includes(req.user.username)) {
    post.likes.push(req.user.username);
  }

  await post.save();
  res.json(post);
};

exports.commentPost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    username: req.user.username,
    text: req.body.text
  });

  await post.save();
  res.json(post);
};


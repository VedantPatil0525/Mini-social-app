const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const text = req.body?.text || "";

    const image = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : "";

    const post = new Post({
      user: req.user.id,
      username: req.user.username,
      text,
      image
    });

    await post.save();
    res.status(201).json(post);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Post failed" });
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


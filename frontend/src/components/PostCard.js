import { useState } from "react";
import API from "../api/api";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const styles = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "16px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, transform 0.2s",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  username: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    letterSpacing: "-0.2px",
  },
  timestamp: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.35)",
    marginTop: "2px",
  },
  postText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.82)",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  image: {
    width: "100%",
    borderRadius: "14px",
    marginBottom: "16px",
    display: "block",
    maxHeight: "380px",
    objectFit: "cover",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "16px",
  },
  likeBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "100px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  commentCount: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.4)",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "16px",
  },
  commentRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "100px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },
  commentBtn: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    border: "none",
    borderRadius: "100px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
    transition: "opacity 0.15s",
  },
};

export default function PostCard({ post, refresh }) {
  const [comment, setComment] = useState("");
  const user = localStorage.getItem("username");
  const [liked, setLiked] = useState(post.likes.includes(user));
  const [commentFocused, setCommentFocused] = useState(false);
  const token = localStorage.getItem("token");

  const likePost = async () => {
  setLiked(!liked);

  try {
    await API.put(`/posts/like/${post._id}`, {}, {
      headers: { Authorization: token },
    });
    refresh();
  } catch (err) {
    console.error(err);
    alert("Like failed");
    setLiked(!liked); // rollback UI if failed
  }
  };

  const addComment = async () => {
  if (!comment.trim()) return;

  try {
    await API.put(`/posts/comment/${post._id}`, { text: comment }, {
      headers: { Authorization: token },
    });

    setComment("");
    refresh();

  } catch (err) {
    console.error(err);
    alert("Comment failed");
  }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addComment();
  };

  const initials = post.username?.slice(0, 2).toUpperCase() || "?";

  return (
    <div
      style={styles.card}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.25)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>{initials}</div>
        <div>
          <div style={styles.username}>{post.username}</div>
          <div style={styles.timestamp}>{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      {/* Post text */}
      {post.text && <div style={styles.postText}>{post.text}</div>}

      {/* Image */}
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt="post"
          style={styles.image}
        />
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.likeBtn,
            background: liked ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
            borderColor: liked ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)",
            color: liked ? "#a78bfa" : "rgba(255,255,255,0.6)",
          }}
          onClick={likePost}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = liked ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)")}
        >
          ♥ {post.likes.length}
        </button>
        <div style={styles.commentCount}>
          💬 {post.comments.length}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Comment input */}
      <div style={styles.commentRow}>
        <input
          style={{
            ...styles.commentInput,
            borderColor: commentFocused ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)",
          }}
          placeholder="Write a comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => setCommentFocused(true)}
          onBlur={() => setCommentFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <button
          style={styles.commentBtn}
          onClick={addComment}
          disabled={!comment.trim()}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Post
        </button>
      </div>
    </div>
  );
}
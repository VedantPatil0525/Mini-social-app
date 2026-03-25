import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import PostCard from "../components/PostCard";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #1a1a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: "60px",
  },

  // ── Navbar ──
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(15,12,41,0.75)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navLogoIcon: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
  },
  navLogoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  greeting: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.45)",
  },
  greetingName: {
    color: "#a78bfa",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "7px 16px",
    borderRadius: "100px",
    border: "1px solid rgba(255,100,100,0.3)",
    background: "rgba(255,100,100,0.08)",
    color: "rgba(255,120,120,0.9)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },

  // ── Content ──
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "32px 20px 0",
  },

  // ── Composer ──
  composer: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "28px",
  },
  composerTop: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  composerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "15px",
    resize: "none",
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: "1.6",
    padding: "6px 0",
    width: "100%",
  },
  composerDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "14px",
  },
  composerBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "100px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
    userSelect: "none",
  },
  postBtn: {
    padding: "9px 24px",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    border: "none",
    borderRadius: "100px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.15s, transform 0.1s",
  },
  fileName: {
    fontSize: "12px",
    color: "#a78bfa",
    marginLeft: "4px",
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // ── Feed section label ──
  sectionLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.25)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },

  emptyState: {
    textAlign: "center",
    padding: "48px 0",
    color: "rgba(255,255,255,0.25)",
    fontSize: "15px",
  },
};

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    if (!token) navigate("/");
    fetchPosts();
  }, [token, navigate]);

  const fetchPosts = async () => {
  try {
    const res = await API.get("/posts");
    setPosts(res.data);
  } catch (err) {
    console.log(err);
  }
  };

  const createPost = async () => {
  if (!text.trim() && !image) return;

  setPosting(true);

  try {
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    await API.post("/posts", formData, {
      headers: { Authorization: token },
    });

    setText("");
    setImage(null);
    fetchPosts();

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "Post failed");

  } finally {
    setPosting(false);
  }
  };

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.page}>

        {/* Navbar */}
        <nav style={styles.navbar}>
          <div style={styles.navLogo}>
            <div style={styles.navLogoIcon}>✦</div>
            <span style={styles.navLogoText}>Pulse</span>
          </div>
          <div style={styles.navRight}>
            <span style={styles.greeting}>
              Hey, <span style={styles.greetingName}>{username}</span>
            </span>
            <button
              style={styles.logoutBtn}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,100,100,0.16)";
                e.currentTarget.style.borderColor = "rgba(255,100,100,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,100,100,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)";
              }}
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div style={styles.content}>

          {/* Composer */}
          <div style={styles.composer}>
            <div style={styles.composerTop}>
              <div style={styles.composerAvatar}>{initials}</div>
              <textarea
                style={styles.textarea}
                placeholder="What's on your mind?"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div style={styles.composerDivider} />
            <div style={styles.composerBottom}>
              <label style={styles.fileLabel}>
                📎 {image ? <span style={styles.fileName}>{image.name}</span> : "Attach image"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <button
                style={{ ...styles.postBtn, opacity: posting ? 0.65 : 1 }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={createPost}
                disabled={posting || (!text.trim() && !image)}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>

          {/* Posts */}
          <div style={styles.sectionLabel}>Recent posts</div>

          {posts.length === 0 ? (
            <div style={styles.emptyState}>No posts yet. Be the first! ✨</div>
          ) : (
            posts.map((p) => (
              <PostCard key={p._id} post={p} refresh={fetchPosts} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
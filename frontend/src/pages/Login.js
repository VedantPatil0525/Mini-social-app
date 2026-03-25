import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
    justifyContent: "center",
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  subtext: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "32px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "8px",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #a78bfa, #6366f1)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.4)",
  },
  link: {
    color: "#a78bfa",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleLogin = async () => {
  // ✅ ADD HERE (TOP OF FUNCTION)
  if (!form.email || !form.password) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    navigate("/feed");
  } catch (err) {
    alert(err.response?.data?.msg || "Login failed");
  } finally {
    setLoading(false);
  }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>✦</div>
            <span style={styles.logoText}>Pulse</span>
          </div>

          <div style={styles.heading}>Welcome back</div>
          <div style={styles.subtext}>Sign in to continue to your feed</div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <input
              style={{
                ...styles.input,
                borderColor: focused === "email" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.12)",
                background: focused === "email" ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.06)",
              }}
              type="email"
              placeholder="you@example.com"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={{
                ...styles.input,
                borderColor: focused === "password" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.12)",
                background: focused === "password" ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.06)",
              }}
              type="password"
              placeholder="••••••••"
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleLogin}
            onMouseOver={(e) => (e.target.style.opacity = "0.88")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div style={styles.footer}>
            Don't have an account?{" "}
            <span style={styles.link} onClick={() => navigate("/signup")}>
              Create one
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
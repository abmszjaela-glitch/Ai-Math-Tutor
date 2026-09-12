import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Settings, Sparkles, Brain, Play, MessageSquare,
  Trophy, ChevronRight, Plus, Download, FolderOpen, Send, Sun, Moon,
  Menu, X, Flame, CheckCircle2, Circle, Clock, Star, Zap, Target,
  BookOpen, Calendar, Users, BarChart3, Share2, TrendingUp
} from "lucide-react";

/* ---------------------------------------------------------
   MathMate — an animated, gamified student dashboard
   Signature idea: a soft "graph paper" backdrop + orbiting
   ring progress meters tie the whole thing back to math,
   while a violet→indigo→blue gradient carries the AI-tutor
   moments so they always feel distinct from plain data.
--------------------------------------------------------- */

function useCountUp(target, duration = 1200, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return value;
}

function RingStat({ value, max = 100, size = 56, stroke = 6, color, trigger }) {
  const animated = useCountUp(value, 1100, trigger);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(animated / max, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c - pct * c} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" }}
      />
    </svg>
  );
}

function Confetti({ x, y, active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 14 });
  const colors = ["#7c3aed", "#3b82f6", "#f59e0b", "#10b981", "#f43f5e"];
  return (
    <div style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 999 }}>
      {pieces.map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            "--dx": `${(Math.random() - 0.5) * 160}px`,
            "--dy": `${-Math.random() * 140 - 40}px`,
            "--rot": `${Math.random() * 360}deg`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api";

  const [dark, setDark] = useState(false);
  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([
    { title: "Complete Algebra Assignment", due: "Today, 11:59 PM", priority: "High", color: "#ef4444", bg: "#fee2e2", done: false },
    { title: "Review Geometry Notes", due: "Tomorrow, 10:00 AM", priority: "Medium", color: "#f97316", bg: "#ffedd5", done: false },
    { title: "Practice Fractions Quiz", due: "In 2 days, 8:00 PM", priority: "Low", color: "#3b82f6", bg: "#dbeafe", done: false },
  ]);
  const [confetti, setConfetti] = useState({ active: false, x: 0, y: 0 });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [unlockedPulse, setUnlockedPulse] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await fetch(`${API_URL}/students/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }
          throw new Error(data.message || "Failed to load student profile");
        }

        setStudent(data.student);
      } catch (error) {
        console.error("Student profile error:", error);
      } finally {
        setLoadingStudent(false);
      }
    };

    loadStudent();
  }, [navigate]);

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const recentActivities = [
    { title: "Completed Fractions Quiz", subject: "Mathematics", time: "15 minutes ago", icon: "✅", iconBg: "#d1fae5", iconColor: "#059669", score: "92%" },
    { title: "Started Algebra Lesson", subject: "Mathematics", time: "1 hour ago", icon: "▶️", iconBg: "#dbeafe", iconColor: "#2563eb", progress: "25%" },
    { title: "Asked AI Tutor a question", subject: "Geometry", time: "2 hours ago", icon: "💬", iconBg: "#ede9fe", iconColor: "#7c3aed", response: "Answered" },
    { title: "Earned a new achievement", subject: "Learning", time: "Yesterday", icon: "🏆", iconBg: "#fef3c7", iconColor: "#d97706", achievement: "Math Master" },
  ];

  const allCourses = [
    { name: "Mathematics", progress: 78, lessons: "18 / 24 lessons", bg: "#eff6ff", iconBg: "#3b82f6", instructor: "Dr. Sarah Johnson", nextLesson: "Quadratic Equations", dueDate: "Tomorrow" },
    { name: "Fractions", progress: 64, lessons: "8 / 12 lessons", bg: "#f3e8ff", iconBg: "#8b5cf6", instructor: "Prof. Michael Chen", nextLesson: "Mixed Numbers", dueDate: "In 3 days" },
    { name: "Geometry", progress: 42, lessons: "5 / 12 lessons", bg: "#fff7ed", iconBg: "#f97316", instructor: "Ms. Emily Davis", nextLesson: "Triangles", dueDate: "In 5 days" },
  ];
  const courses = allCourses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [achievements, setAchievements] = useState([
    { name: "Math Wizard", icon: "⭐", bg: "#fef3c7", color: "#d97706", unlocked: true },
    { name: "Quick Learner", icon: "⚡", bg: "#dbeafe", color: "#2563eb", unlocked: true },
    { name: "Perfect Score", icon: "🎯", bg: "#f3e8ff", color: "#7c3aed", unlocked: false },
    { name: "Study Streak", icon: "🔥", bg: "#d1fae5", color: "#059669", unlocked: false },
  ]);

  const notifications = [
    { message: "New lesson available: Algebra II", time: "5 min ago", read: false },
    { message: "Your quiz result is ready", time: "1 hour ago", read: false },
    { message: "Weekly report generated", time: "3 hours ago", read: true },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTask = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTasks((prev) => {
      const next = [...prev];
      const wasDone = next[index].done;
      next[index] = { ...next[index], done: !wasDone };
      if (!wasDone) {
        setConfetti({ active: true, x: rect.left, y: rect.top });
        setTimeout(() => setConfetti((c) => ({ ...c, active: false })), 900);
      }
      return next;
    });
  };

  const tryUnlock = (index) => {
    setAchievements((prev) => {
      if (prev[index].unlocked) return prev;
      const next = [...prev];
      next[index] = { ...next[index], unlocked: true };
      setUnlockedPulse(index);
      setTimeout(() => setUnlockedPulse(null), 1000);
      return next;
    });
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;

    const q = chatInput.trim();

    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      {
        role: "ai",
        text: "Let's solve that together in the full AI Tutor. Choose your tutor and we'll work through it step by step.",
      },
    ]);

    setChatInput("");

    setTimeout(() => {
      goTo("/SelectFriend");
    }, 500);
  };

  const t = tokens(dark);

  const navItems = [
    { icon: TrendingUp, label: "Dashboard", id: "dashboard", route: "/dashboard" },
    { icon: BookOpen, label: "My Courses", id: "courses", route: "/start-learning" },
    { icon: Brain, label: "AI Tutor", id: "tutor", route: "/SelectFriend", badge: "AI" },
    { icon: Calendar, label: "Schedule", id: "schedule" },
    { icon: Trophy, label: "Achievements", id: "achievements" },
    { icon: Users, label: "Study Groups", id: "groups" },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
  ];

  return (
    <div style={{ ...s.container, background: t.appBg, color: t.ink }}>
      <style>{css}</style>
      <Confetti {...confetti} />

      {/* Mobile overlay */}
      {sidebarOpen && <div style={s.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className="slide-sidebar"
        style={{
          ...s.sidebar,
          background: t.sidebarBg,
          borderRight: `1px solid ${t.border}`,
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <div style={s.logo}>
              <div className="float-icon" style={s.logoIcon}><Brain size={22} /></div>
              <div>
                <h1 style={{ ...s.logoText, color: t.ink }}>Math<span style={{ color: "#7c3aed" }}>Mate</span></h1>
                <p style={{ ...s.logoSub, color: t.muted }}>AI Learning Platform</p>
              </div>
            </div>
            <button className="icon-btn-plain" style={{ display: "none" }} />
            <X size={20} className="mobile-only" style={{ cursor: "pointer", color: t.muted }} onClick={() => setSidebarOpen(false)} />
          </div>

          <div style={{ position: "relative", marginBottom: "22px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.muted }} />
            <input
              type="text"
              placeholder="Search courses..."
              className="focus-ring"
              style={{ ...s.searchInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.ink }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href="#"
                  className="nav-item"
                  style={{
                    ...s.navItem,
                    color: active ? "#7c3aed" : t.muted,
                    background: active ? (dark ? "rgba(124,58,237,0.18)" : "linear-gradient(to right, #f5f3ff, #eff6ff)") : "transparent",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.route) {
                      goTo(item.route);
                    } else {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon size={17} />
                  {item.label}
                  {item.badge && <span style={s.navBadge}>{item.badge}</span>}
                </a>
              );
            })}
          </nav>

          <div className="glow-card" style={{ ...s.bottomCard, marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles size={20} />
              <h3 style={{ fontWeight: "bold", margin: 0 }}>Need help?</h3>
            </div>
            <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: "20px", color: "#c7d2fe" }}>
              Ask your AI Tutor anything about mathematics.
            </p>
            <button className="btn-press" style={s.bottomCardButton} onClick={() => goTo("/SelectFriend")}>
              Ask AI Tutor <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main} className="main-responsive">
        <header style={{ ...s.header, background: t.headerBg, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Menu size={22} className="mobile-only" style={{ cursor: "pointer", color: t.muted }} onClick={() => setSidebarOpen(true)} />
            <div>
              <p style={{ ...s.headerDate, color: t.muted }}>
                <Calendar size={14} /> {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h2 className={mounted ? "fade-in-up" : ""} style={{ ...s.headerTitle, color: t.ink }}>Good morning, Alex 👋</h2>
              <p style={{ ...s.headerSub, color: t.muted }}>Ready to continue your learning journey?</p>
            </div>
          </div>

          <div style={s.headerActions}>
            <button className="icon-btn" style={{ ...s.iconBtn, background: t.pillBg, color: t.ink }} onClick={() => setDark((d) => !d)} title="Toggle theme">
              <span className="rotate-swap">{dark ? <Sun size={18} /> : <Moon size={18} />}</span>
            </button>

            <div style={{ position: "relative" }}>
              <button
                className={`icon-btn ${unreadCount ? "shake-badge" : ""}`}
                style={{ ...s.iconBtn, background: t.pillBg, color: t.ink }}
                onClick={() => setShowNotifications((v) => !v)}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="pulse-dot" style={s.notificationDot} />}
              </button>

              {showNotifications && (
                <div className="pop-in" style={{ ...s.notificationDropdown, background: t.cardBg, border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, paddingBottom: "8px" }}>
                    <h4 style={{ fontWeight: "600", color: t.ink, margin: 0 }}>Notifications</h4>
                    <button style={{ fontSize: "12px", color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    {notifications.map((n, i) => (
                      <div key={i} style={{ padding: "12px", borderRadius: "12px", marginBottom: "8px", background: n.read ? "transparent" : (dark ? "rgba(124,58,237,0.15)" : "#f5f3ff") }}>
                        <p style={{ color: t.ink, fontSize: "14px", margin: 0 }}>{n.message}</p>
                        <p style={{ marginTop: "4px", fontSize: "12px", color: t.muted, margin: "4px 0 0" }}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={s.profile}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: t.ink, margin: 0 }}>
                  {student?.name || "Student"}
                </p>
                <p style={{ fontSize: "12px", color: t.muted, margin: 0 }}>
                  {student?.grade?.name || "Math Student"}
                </p>
              </div>
              <div className="avatar-ring" style={s.profileAvatar}>
                {(student?.name || "Student")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>

            <button
              className="icon-btn spin-hover"
              style={{ ...s.iconBtn, background: t.pillBg, color: t.ink }}
              onClick={() => setActiveTab("settings")}
              title="Settings"
            >
              <Settings size={18} />
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </header>

        <div style={{ padding: "28px 32px 48px" }} className="graph-paper">
          {/* Stats */}
          <div style={s.statsGrid} className="stats-grid-responsive">
            {[
              { label: "Learning Time (Week)", value: "6.5h", badge: "+12%", icon: Clock, color: "#2563eb", bg: "#dbeafe", ring: 65, ringColor: "#2563eb" },
              { label: "Lessons Completed", value: "24", badge: "+5", icon: CheckCircle2, color: "#059669", bg: "#d1fae5", ring: 80, ringColor: "#059669" },
              { label: "Average Score", value: "92%", badge: "87%", icon: Trophy, color: "#7c3aed", bg: "#ede9fe", ring: 92, ringColor: "#7c3aed" },
              { label: "Learning Streak", value: "7 Days", badge: "🔥", icon: Flame, color: "#f97316", bg: "#ffedd5", ring: 70, ringColor: "#f97316" },
            ].map((stat, i) => (
              <div key={i} className={`stat-card ${mounted ? "fade-in-up" : ""}`} style={{ ...s.statCard, background: t.cardBg, boxShadow: t.cardShadow, animationDelay: `${i * 70}ms` }}>
                <div style={s.statHeader}>
                  <div style={{ ...s.statIcon, background: stat.bg, color: stat.color }}>
                    {stat.icon === Flame ? <span className="flame-pulse"><Flame size={19} /></span> : <stat.icon size={19} />}
                  </div>
                  <span style={{ ...s.statBadge, color: stat.color }}>{stat.badge}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "10px" }}>
                  <RingStat value={stat.ring} color={stat.ringColor} trigger={mounted} />
                  <div>
                    <p style={{ ...s.statValue, color: t.ink }}>{stat.value}</p>
                    <p style={{ ...s.statLabel, color: t.muted }}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Tutor + Tasks */}
          <div style={s.aiTutorGrid} className="ai-tutor-grid-responsive">
            <div className="ai-card-shine" style={s.aiTutorCard}>
              <div style={{ position: "absolute", right: "-64px", top: "-64px", width: "192px", height: "192px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} className="drift-blob" />
              <div style={{ position: "absolute", bottom: "-96px", right: "96px", width: "224px", height: "224px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} className="drift-blob-slow" />

              <div style={{ position: "relative", zIndex: 10 }}>
                <div style={s.aiTutorHeader}>
                  <div className="pulse-ring" style={s.aiTutorIcon}><Brain size={24} /></div>
                  <div>
                    <p style={s.aiTutorSub}>Your Personal AI Tutor</p>
                    <h3 style={{ ...s.aiTutorTitle, display: "flex", alignItems: "center", gap: "6px" }}>Ask me anything! <Sparkles size={16} /></h3>
                  </div>
                </div>

                <p style={s.aiTutorDesc}>
                  Stuck on a math problem? I can explain concepts step by step, give you examples, and help you understand the answer.
                </p>

                {chatMessages.length > 0 && (
                  <div style={s.chatLog}>
                    {chatMessages.map((m, i) => (
                      <div key={i} className="fade-in-up" style={{ ...s.chatBubble, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)" }}>
                        {m.text}
                      </div>
                    ))}
                    {aiTyping && <div style={{ ...s.chatBubble, alignSelf: "flex-start", background: "rgba(255,255,255,0.12)" }}><TypingDots /></div>}
                  </div>
                )}

                <div style={s.chatInput}>
                  <input
                    type="text"
                    placeholder="Ask your AI Tutor a question..."
                    style={s.chatInputField}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  />
                  <button className="btn-press" style={s.chatSendBtn} onClick={sendChat}><Send size={17} /></button>
                </div>

                <div style={s.suggestions}>
                  {["Explain fractions", "Help with algebra", "Practice geometry"].map((text) => (
                    <button key={text} className="chip-hover" style={s.suggestionBtn} onClick={() => setChatInput(text)}>
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...s.tasksCard, background: t.cardBg, boxShadow: t.cardShadow }}>
              <div style={s.tasksHeader}>
                <h3 style={{ ...s.tasksTitle, color: t.ink }}>Upcoming Tasks</h3>
                <button style={{ ...s.tasksViewAll }}>View all</button>
              </div>

              <div>
                {tasks.map((task, index) => (
                  <div key={index} className="task-row" style={{ ...s.taskItem, border: `1px solid ${t.border}`, opacity: task.done ? 0.55 : 1 }}>
                    <span onClick={(e) => toggleTask(index, e)} style={{ cursor: "pointer", marginTop: "2px", color: task.done ? "#10b981" : t.muted }} className="check-pop">
                      {task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ ...s.taskTitle, color: t.ink, textDecoration: task.done ? "line-through" : "none" }}>{task.title}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        <span style={{ ...s.taskPriority, background: task.bg, color: task.color }}>{task.priority}</span>
                        <span style={{ fontSize: "12px", color: t.muted }}>{task.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="dash-btn-hover" style={{ ...s.addTaskBtn, border: `2px dashed ${t.border}`, color: t.muted }}>
                <Plus size={16} /> Add Task
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <section style={{ marginTop: "28px" }}>
            <div style={s.sectionHeader}>
              <div>
                <h3 style={{ ...s.sectionTitle, color: t.ink }}>Recent Activity</h3>
                <p style={{ ...s.sectionSub, color: t.muted }}>Keep track of your latest learning activities</p>
              </div>
              <div style={s.sectionActions}>
                <button className="dash-btn-hover" style={{ ...s.actionBtn, border: `1px solid ${t.border}`, background: t.cardBg, color: t.ink }}>
                  <Download size={14} /> Export
                </button>
                <button style={{ ...s.actionBtn, border: "none", color: "#7c3aed", background: "transparent" }}>
                  View all <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div style={s.activityGrid} className="activity-grid-responsive">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item-hover" style={{ ...s.activityItem, border: `1px solid ${t.border}`, background: t.cardBg, boxShadow: t.cardShadow }}>
                  <div style={{ ...s.activityIcon, background: activity.iconBg, color: activity.iconColor }}>{activity.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ ...s.activityTitle, color: t.ink }}>{activity.title}</h4>
                    <p style={{ ...s.activityMeta, color: t.muted }}>{activity.subject} · {activity.time}</p>
                    {activity.score && <span style={s.activityScore}>Score: {activity.score}</span>}
                  </div>
                  <ChevronRight size={16} color={t.muted} />
                </div>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section style={{ marginTop: "28px" }}>
            <div style={s.sectionHeader}>
              <div>
                <h3 style={{ ...s.sectionTitle, color: t.ink }}>Continue Learning</h3>
                <p style={{ ...s.sectionSub, color: t.muted }}>{searchQuery ? `Results for "${searchQuery}"` : "Pick up where you left off"}</p>
              </div>
              <div style={s.sectionActions}>
                <button
                  className="dash-btn-hover"
                  style={{ ...s.actionBtn, border: `1px solid ${t.border}`, background: t.cardBg, color: t.ink }}
                  onClick={() => goTo("/start-learning")}
                >
                  <FolderOpen size={14} /> Browse All
                </button>
              </div>
            </div>

            <div style={s.coursesGrid} className="courses-grid-responsive">
              {courses.length === 0 && <p style={{ color: t.muted }}>No courses match your search.</p>}
              {courses.map((course) => (
                <div key={course.name} className="course-card-hover" style={{ ...s.courseCard, background: course.bg }}>
                  <div style={s.courseHeader}>
                    <div style={{ ...s.courseIcon, background: course.iconBg }}><BookOpen size={20} /></div>
                    <span style={s.courseProgress}>{course.progress}%</span>
                  </div>
                  <h4 style={s.courseName}>{course.name}</h4>
                  <p style={s.courseInstructor}>{course.instructor}</p>
                  <div style={s.courseDetails}>
                    <span>{course.lessons}</span>
                    <span>Next: {course.nextLesson}</span>
                  </div>
                  <div style={s.progressBar}>
                    <div className="fill-anim" style={{ ...s.progressFill, "--target-width": `${course.progress}%`, background: course.iconBg }} />
                  </div>
                  <div style={s.courseFooter}>
                    <span style={s.courseDue}>Due: {course.dueDate}</span>
                    <button
                      className="btn-press"
                      style={s.courseContinue}
                      onClick={() => goTo("/start-learning")}
                    >
                      Continue <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section style={{ marginTop: "28px", padding: "24px", borderRadius: "24px", background: t.cardBg, boxShadow: t.cardShadow }}>
            <div style={s.sectionHeader}>
              <div>
                <h3 style={{ ...s.sectionTitle, color: t.ink }}>Achievements</h3>
                <p style={{ ...s.sectionSub, color: t.muted }}>Tap a locked badge for a sneak peek</p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  onClick={() => tryUnlock(index)}
                  className={`achievement-hover ${unlockedPulse === index ? "unlock-pulse" : ""}`}
                  style={{
                    ...s.achievementItem,
                    cursor: "pointer",
                    border: achievement.unlocked ? "1px solid #a7f3d0" : `1px solid ${t.border}`,
                    background: achievement.unlocked ? "rgba(209, 250, 229, 0.5)" : (dark ? "rgba(255,255,255,0.03)" : "rgba(248, 250, 252, 0.5)"),
                    opacity: achievement.unlocked ? 1 : 0.6,
                  }}
                >
                  <div style={{ ...s.achievementIconBox, background: achievement.bg, color: achievement.color }}>{achievement.icon}</div>
                  <div>
                    <p style={{ ...s.achievementName, color: t.ink }}>{achievement.name}</p>
                    <p style={{ fontSize: "12px", color: t.muted, margin: 0 }}>{achievement.unlocked ? "Unlocked" : "Tap to preview"}</p>
                  </div>
                  {achievement.unlocked && <CheckCircle2 size={16} color="#10b981" style={{ marginLeft: "6px" }} />}
                </div>
              ))}
            </div>
          </section>

          {/* Motivation */}
          <section className="motivation-shine" style={{ ...s.motivationCard, background: t.motivationBg }}>
            <div style={s.motivationContent}>
              <div style={s.motivationLeft}>
                <div className="flame-pulse-big" style={s.motivationEmoji}><Flame size={30} /></div>
                <div>
                  <h3 style={{ ...s.motivationTitle, color: t.ink }}>You're on a 7-day learning streak!</h3>
                  <p style={{ ...s.motivationDesc, color: t.muted }}>
                    Keep learning today to reach your next milestone.
                    <span style={s.motivationHighlight}> 2 days to go!</span>
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-press" style={s.primaryBtn} onClick={() => goTo("/start-learning")}>
                  <Play size={16} /> Start Learning
                </button>
                <button className="btn-press" style={{ ...s.secondaryBtn, background: t.cardBg, color: t.ink, border: `1px solid ${t.border}` }}><Share2 size={16} /> Share</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function tokens(dark) {
  return dark
    ? {
        appBg: "#0b1020", ink: "#e6e9f5", muted: "#8b93b0", border: "rgba(255,255,255,0.08)",
        cardBg: "#131a30", sidebarBg: "rgba(19,26,48,0.85)", headerBg: "rgba(11,16,32,0.75)",
        inputBg: "#0f1526", pillBg: "#1a2138", cardShadow: "0 1px 2px rgba(0,0,0,0.4)",
        motivationBg: "linear-gradient(to right, rgba(124,58,237,0.15), rgba(59,130,246,0.15))",
      }
    : {
        appBg: "#f8fafc", ink: "#0f172a", muted: "#64748b", border: "#e2e8f0",
        cardBg: "#ffffff", sidebarBg: "rgba(255,255,255,0.8)", headerBg: "rgba(255,255,255,0.8)",
        inputBg: "#f8fafc", pillBg: "#f1f5f9", cardShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        motivationBg: "linear-gradient(to right, #f5f3ff, #eff6ff)",
      };
}

const css = `
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 8px; }
  .graph-paper {
    background-image: radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in-up { animation: fadeInUp 0.55s cubic-bezier(.22,1,.36,1) both; }
  @keyframes floatIcon { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-4deg); } }
  .float-icon { animation: floatIcon 3.2s ease-in-out infinite; }
  @keyframes pulseDot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.25); opacity: 0.7; } }
  .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite; }
  @keyframes shakeBadge { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-10deg); } 40% { transform: rotate(9deg); } 60% { transform: rotate(-6deg); } 80% { transform: rotate(4deg); } }
  .shake-badge:hover { animation: shakeBadge 0.5s ease; }
  @keyframes popIn { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .pop-in { animation: popIn 0.22s cubic-bezier(.22,1,.36,1) both; }
  .icon-btn { border: none; border-radius: 50%; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; cursor: pointer; transition: transform 0.18s ease, background 0.2s ease; }
  .icon-btn:hover { transform: translateY(-2px) scale(1.05); }
  .icon-btn:active { transform: scale(0.94); }
  .spin-hover:hover svg { transition: transform 0.4s ease; transform: rotate(90deg); }
  .rotate-swap { display:inline-flex; transition: transform 0.4s cubic-bezier(.22,1,.36,1); }
  .icon-btn:hover .rotate-swap { transform: rotate(20deg) scale(1.1); }
  @keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
  .pulse-ring { animation: ringPulse 2.4s ease-in-out infinite; }
  @keyframes flamePulse { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(249,115,22,0.5)); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 6px rgba(249,115,22,0.6)); } }
  .flame-pulse { display:inline-flex; animation: flamePulse 1.8s ease-in-out infinite; }
  .flame-pulse-big { animation: flamePulse 2s ease-in-out infinite; }
  .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(124,58,237,0.25); }
  .ai-card-shine { position: relative; overflow: hidden; padding: 28px; border-radius: 24px; background: linear-gradient(120deg, #7c3aed, #4f46e5, #2563eb); color: white; box-shadow: 0 20px 25px -5px rgba(99,102,241,0.3); }
  @keyframes driftBlob { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-8px, 10px); } }
  .drift-blob { animation: driftBlob 7s ease-in-out infinite; }
  .drift-blob-slow { animation: driftBlob 11s ease-in-out infinite reverse; }
  .chip-hover { transition: all 0.2s ease; }
  .chip-hover:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-2px); }
  .btn-press { transition: transform 0.15s ease, filter 0.2s ease; }
  .btn-press:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .btn-press:active { transform: scale(0.96); }
  .task-row { transition: transform 0.2s ease, background 0.2s ease; }
  .task-row:hover { transform: translateX(3px); }
  @keyframes checkPop { 0% { transform: scale(1); } 50% { transform: scale(1.35); } 100% { transform: scale(1); } }
  .check-pop:active { animation: checkPop 0.3s ease; }
  .dash-btn-hover { transition: all 0.2s ease; }
  .dash-btn-hover:hover { border-color: #a78bfa !important; color: #7c3aed !important; transform: translateY(-1px); }
  .activity-item-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .activity-item-hover:hover { transform: translateY(-3px); box-shadow: 0 14px 24px -10px rgba(15,23,42,0.18); }
  .course-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .course-card-hover:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 18px 30px -12px rgba(15,23,42,0.22); }
  @keyframes fillWidth { from { width: 0; } }
  .fill-anim { animation: fillWidth 1.3s cubic-bezier(.22,1,.36,1) both; width: var(--target-width); }
  .achievement-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .achievement-hover:hover { transform: translateY(-3px) rotate(-1deg); }
  @keyframes unlockPulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); } 70% { box-shadow: 0 0 0 16px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
  .unlock-pulse { animation: unlockPulse 0.9s ease; }
  .motivation-shine { position: relative; overflow: hidden; }
  .motivation-shine::after { content:""; position:absolute; top:0; left:-60%; width:40%; height:100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent); animation: shine 5s ease-in-out infinite; }
  @keyframes shine { 0% { left: -60%; } 40%,100% { left: 130%; } }
  .avatar-ring { transition: box-shadow 0.25s ease; }
  .avatar-ring:hover { box-shadow: 0 0 0 4px rgba(124,58,237,0.25); }
  @keyframes confettiFall { to { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; } }
  .confetti-piece { position:absolute; width:7px; height:7px; border-radius: 2px; animation: confettiFall 0.85s ease-out forwards; }
  @keyframes typingBounce { 0%,80%,100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-4px); opacity: 1; } }
  .typing-dots { display:flex; gap: 4px; padding: 2px; }
  .typing-dots span { width:6px; height:6px; border-radius:50%; background: white; animation: typingBounce 1.2s ease-in-out infinite; }
  .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.3s; }
  .mobile-only { display: none; }
  .slide-sidebar { transition: transform 0.3s cubic-bezier(.22,1,.36,1); }
  @media (max-width: 1024px) {
    .mobile-only { display: block; }
    .slide-sidebar { position: fixed; z-index: 50; transform: translateX(-100%); top:0; left:0; }
    .main-responsive { margin-left: 0 !important; }
    .stats-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; }
    .ai-tutor-grid-responsive { grid-template-columns: 1fr !important; }
    .activity-grid-responsive { grid-template-columns: 1fr !important; }
    .courses-grid-responsive { grid-template-columns: 1fr !important; }
  }
  .focus-ring:focus { outline: none; box-shadow: 0 0 0 3px rgba(124,58,237,0.25); border-color: #a78bfa !important; }
  .logout-btn {
    border: none;
    border-radius: 12px;
    padding: 10px 13px;
    background: #fee2e2;
    color: #dc2626;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .logout-btn:hover {
    background: #fecaca;
    transform: translateY(-1px);
  }
  .logout-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

const s = {
  container: { minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 },
  sidebar: { position: "fixed", left: 0, top: 0, height: "100vh", width: "260px", backdropFilter: "blur(20px)", zIndex: 45 },
  logo: { display: "flex", alignItems: "center", gap: "12px" },
  logoIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "16px", background: "linear-gradient(to bottom right, #7c3aed, #3b82f6)", color: "white", boxShadow: "0 10px 15px -3px rgba(124,58,237,0.3)" },
  logoText: { fontSize: "18px", fontWeight: "bold", margin: 0 },
  logoSub: { fontSize: "12px", margin: 0 },
  searchInput: { width: "100%", padding: "9px 16px 9px 38px", borderRadius: "12px", fontSize: "14px", outline: "none" },
  navItem: { display: "flex", alignItems: "center", gap: "12px", padding: "11px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer", textDecoration: "none" },
  navBadge: { marginLeft: "auto", padding: "2px 8px", borderRadius: "9999px", background: "#ede9fe", fontSize: "11px", fontWeight: "600", color: "#7c3aed" },
  bottomCard: { padding: "20px", borderRadius: "16px", background: "linear-gradient(to bottom right, #7c3aed, #3b82f6)", color: "white", boxShadow: "0 10px 15px -3px rgba(124,58,237,0.3)" },
  bottomCardButton: { width: "100%", padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px" },
  main: { marginLeft: "260px" },
  header: { position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(20px)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerDate: { fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px", margin: 0 },
  headerTitle: { marginTop: "4px", fontSize: "28px", fontWeight: "bold", margin: "4px 0 0" },
  headerSub: { marginTop: "2px", fontSize: "14px", margin: "2px 0 0" },
  headerActions: { display: "flex", alignItems: "center", gap: "10px" },
  iconBtn: { position: "relative", width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", top: "6px", right: "8px", width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", border: "2px solid white" },
  notificationDropdown: { position: "absolute", right: 0, top: "calc(100% + 12px)", width: "300px", borderRadius: "16px", padding: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)", zIndex: 30 },
  profile: { display: "flex", alignItems: "center", gap: "10px" },
  profileAvatar: { width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(to bottom right, #fb923c, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  statCard: { padding: "18px", borderRadius: "18px" },
  statHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  statIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "12px" },
  statBadge: { fontSize: "12px", fontWeight: "600" },
  statValue: { fontSize: "22px", fontWeight: "bold", margin: 0 },
  statLabel: { fontSize: "12px", margin: "2px 0 0" },
  aiTutorGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "24px" },
  aiTutorHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" },
  aiTutorIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" },
  aiTutorTitle: { fontSize: "20px", fontWeight: "bold", margin: 0 },
  aiTutorSub: { fontSize: "14px", fontWeight: "500", color: "#c7d2fe", margin: 0 },
  aiTutorDesc: { maxWidth: "500px", fontSize: "14px", lineHeight: "22px", color: "#c7d2fe" },
  chatLog: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px", maxHeight: "160px", overflowY: "auto" },
  chatBubble: { padding: "8px 14px", borderRadius: "14px", fontSize: "13px", maxWidth: "80%", lineHeight: "18px" },
  chatInput: { display: "flex", alignItems: "center", gap: "8px", marginTop: "18px", padding: "8px", borderRadius: "16px", background: "white", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
  chatInputField: { flex: 1, padding: "0 12px", border: "none", background: "transparent", fontSize: "14px", color: "#334155", outline: "none" },
  chatSendBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "12px", background: "#7c3aed", color: "white", border: "none", cursor: "pointer" },
  suggestions: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" },
  suggestionBtn: { padding: "6px 12px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", color: "white", border: "none", fontSize: "12px", cursor: "pointer", backdropFilter: "blur(4px)" },
  tasksCard: { padding: "22px", borderRadius: "22px" },
  tasksHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  tasksTitle: { fontWeight: "bold", margin: 0 },
  tasksViewAll: { fontSize: "12px", fontWeight: "600", color: "#7c3aed", background: "none", border: "none", cursor: "pointer" },
  taskItem: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", borderRadius: "12px", marginTop: "12px" },
  taskTitle: { fontSize: "14px", fontWeight: "500", margin: 0 },
  taskPriority: { padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: "500" },
  addTaskBtn: { width: "100%", padding: "12px", borderRadius: "12px", background: "transparent", fontSize: "14px", fontWeight: "500", cursor: "pointer", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" },
  sectionTitle: { fontSize: "19px", fontWeight: "bold", margin: 0 },
  sectionSub: { marginTop: "4px", fontSize: "14px", margin: "4px 0 0" },
  sectionActions: { display: "flex", alignItems: "center", gap: "10px" },
  actionBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  activityGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  activityItem: { display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", cursor: "pointer" },
  activityIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: "46px", height: "46px", borderRadius: "16px", fontSize: "20px", flexShrink: 0 },
  activityTitle: { fontSize: "14px", fontWeight: "600", margin: 0 },
  activityMeta: { marginTop: "4px", fontSize: "12px", margin: "4px 0 0" },
  activityScore: { display: "inline-block", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: "600", color: "#059669", background: "#d1fae5", marginTop: "4px" },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  courseCard: { padding: "20px", borderRadius: "22px", cursor: "pointer" },
  courseHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  courseIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "16px", color: "white" },
  courseProgress: { padding: "4px 12px", borderRadius: "9999px", background: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: "bold", color: "#475569" },
  courseName: { marginTop: "16px", fontSize: "18px", fontWeight: "bold", color: "#0f172a" },
  courseInstructor: { marginTop: "4px", fontSize: "12px", color: "#64748b" },
  courseDetails: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", fontSize: "12px", color: "#64748b" },
  progressBar: { marginTop: "12px", height: "8px", borderRadius: "9999px", background: "rgba(255,255,255,0.7)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: "9999px" },
  courseFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" },
  courseDue: { fontSize: "12px", color: "#64748b" },
  courseContinue: { padding: "8px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.85)", border: "none", fontSize: "14px", fontWeight: "600", color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" },
  achievementItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "16px" },
  achievementIconBox: { display: "flex", alignItems: "center", justifyContent: "center", width: "46px", height: "46px", borderRadius: "12px", fontSize: "21px" },
  achievementName: { fontSize: "14px", fontWeight: "500", margin: 0 },
  motivationCard: { marginTop: "28px", overflow: "hidden", padding: "26px", borderRadius: "22px" },
  motivationContent: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" },
  motivationLeft: { display: "flex", alignItems: "center", gap: "16px" },
  motivationEmoji: { display: "flex", alignItems: "center", justifyContent: "center", width: "54px", height: "54px", borderRadius: "16px", background: "#fef3c7", color: "#d97706", boxShadow: "0 10px 15px -3px rgba(251,191,36,0.3)" },
  motivationTitle: { fontWeight: "bold", margin: 0 },
  motivationDesc: { marginTop: "4px", fontSize: "14px", margin: "4px 0 0" },
  motivationHighlight: { fontWeight: "600", color: "#7c3aed" },
  primaryBtn: { padding: "12px 20px", borderRadius: "12px", background: "#0f172a", color: "white", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
  secondaryBtn: { padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
};
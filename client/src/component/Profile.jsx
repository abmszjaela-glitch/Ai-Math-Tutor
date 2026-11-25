import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, GraduationCap, CalendarDays, Save, Trash2, Check } from "lucide-react";
import { API_URL } from "../config/api";

import sunImage from "../assets/img/about/sun.png";
import starImage from "../assets/img/about/star.png";
import loveImage from "../assets/img/about/love.png";

const easeOut = [0.25, 0.1, 0.25, 1];

// Emoji fallback per tutor name (swap for real tutor images if you have them)
const tutorEmoji = { Kangaroo: "🦘", Panda: "🐼", Koala: "🐨" };

const styles = `
  .pf-page {
    position: relative;
    min-height: 100vh;
    padding: 48px 20px 64px;
    background:
      radial-gradient(circle at 12% 8%, rgba(255, 214, 102, 0.35), transparent 38%),
      radial-gradient(circle at 92% 88%, rgba(120, 190, 255, 0.28), transparent 40%),
      var(--color-page, #fbf8f1);
    color: var(--color-text, #14213d);
    overflow: hidden;
  }
  .pf-shape { position: absolute; pointer-events: none; z-index: 0; }
  .pf-shape img { width: 100%; height: auto; display: block; }
  .pf-shape.sun  { top: 28px; right: 6%; width: 84px; opacity: .9; }
  .pf-shape.star { bottom: 90px; left: 5%; width: 54px; opacity: .8; }
  .pf-shape.love { top: 46%; right: 3%; width: 52px; opacity: .7; }

  .pf-wrap { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }

  .pf-back {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 24px;
    border: 1.5px solid var(--color-border, #e6e4dd);
    background: #fff; color: #14213d; font-weight: 600; font-size: 14px;
    text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,.06);
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .pf-back:hover { transform: translateX(-3px); box-shadow: 0 6px 16px rgba(0,0,0,.1); }

  .pf-hero {
    display: flex; align-items: center; gap: 20px;
    margin: 28px 0 24px;
  }
  .pf-avatar {
    flex: none; width: 92px; height: 92px; border-radius: 28px;
    display: grid; place-items: center; font-size: 46px;
    background: linear-gradient(145deg, #ffe08a, #ffb86b);
    box-shadow: 0 10px 24px rgba(255, 170, 70, .35);
  }
  .pf-hero h1 { margin: 0; font-size: clamp(26px, 4vw, 36px); line-height: 1.15; }
  .pf-hero p  { margin: 6px 0 0; opacity: .72; font-size: 15px; }
  .pf-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .pf-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600;
    background: #fff; border: 1px solid var(--color-border, #e6e4dd);
  }

  .pf-card {
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #e6e4dd);
    border-radius: 24px; padding: 28px;
    box-shadow: 0 18px 40px rgba(20, 33, 61, .08);
  }
  .pf-section + .pf-section { margin-top: 28px; padding-top: 28px; border-top: 1px dashed var(--color-border, #e6e4dd); }
  .pf-section h2 { margin: 0 0 4px; font-size: 18px; }
  .pf-section > p { margin: 0 0 16px; font-size: 14px; opacity: .7; }

  .pf-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
  .pf-field { display: grid; gap: 8px; font-weight: 600; font-size: 14px; }
  .pf-field.full { grid-column: 1 / -1; }
  .pf-input-wrap { position: relative; }
  .pf-input-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); opacity: .5; }
  .pf-input {
    width: 100%; padding: 13px 14px 13px 42px; border-radius: 12px;
    border: 1.5px solid var(--color-border, #e6e4dd); background: #fff;
    font-size: 15px; font-weight: 500; color: inherit;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .pf-input:focus { outline: none; border-color: var(--color-primary, #4f46e5); box-shadow: 0 0 0 4px rgba(79, 70, 229, .15); }

  .pf-grades { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .pf-grade {
    padding: 14px 0; border-radius: 14px; cursor: pointer; text-align: center;
    border: 1.5px solid var(--color-border, #e6e4dd); background: #fff;
    font-weight: 700; font-size: 18px; color: inherit; line-height: 1.1;
    transition: transform .15s ease, border-color .15s ease, background .15s ease;
  }
  .pf-grade small { display: block; font-size: 11px; font-weight: 600; opacity: .6; margin-top: 2px; }
  .pf-grade:hover { transform: translateY(-2px); }
  .pf-grade.active { background: var(--color-primary, #4f46e5); border-color: var(--color-primary, #4f46e5); color: var(--color-on-primary, #fff); }
  .pf-grade.active small { opacity: .85; }

  .pf-tutors { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
  .pf-tutor {
    position: relative; padding: 18px 12px; border-radius: 18px; cursor: pointer; text-align: center;
    border: 1.5px solid var(--color-border, #e6e4dd); background: #fff; color: inherit;
    transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
  }
  .pf-tutor:hover { transform: translateY(-3px); }
  .pf-tutor .emoji { font-size: 40px; display: block; }
  .pf-tutor .name  { display: block; margin-top: 6px; font-weight: 700; font-size: 14px; }
  .pf-tutor.active { border-color: var(--color-primary, #4f46e5); box-shadow: 0 0 0 4px rgba(79, 70, 229, .15); }
  .pf-tutor .tick {
    position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; border-radius: 50%;
    display: grid; place-items: center; background: var(--color-primary, #4f46e5); color: #fff;
  }

  .pf-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .pf-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 22px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
  }
  .pf-btn:disabled { opacity: .6; cursor: wait; }
  .pf-btn:not(:disabled):hover { transform: translateY(-2px); }
  .pf-btn.primary { flex: 1; min-width: 180px; border: 0; background: var(--color-primary, #4f46e5); color: var(--color-on-primary, #fff); box-shadow: 0 8px 18px rgba(79, 70, 229, .3); }
  .pf-btn.danger  { border: 1.5px solid var(--color-error, #d64545); background: transparent; color: var(--color-error-text, #b42318); }

  .pf-alert { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; }
  .pf-alert.error   { background: #fdecec; color: var(--color-error-text, #b42318); }
  .pf-alert.success { background: #e8f7ee; color: var(--color-success-text, #137a3f); }

  .pf-loading { min-height: 100vh; display: grid; place-items: center; font-weight: 600; background: var(--color-page, #fbf8f1); color: var(--color-text, #14213d); }

  @media (max-width: 640px) {
    .pf-page { padding: 28px 14px 48px; }
    .pf-card { padding: 20px; border-radius: 20px; }
    .pf-hero { flex-direction: column; align-items: flex-start; }
    .pf-grid { grid-template-columns: 1fr; }
    .pf-grades { grid-template-columns: repeat(3, 1fr); }
    .pf-shape.sun, .pf-shape.love { display: none; }
    .pf-btn { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pf-page * { transition: none !important; }
  }
`;

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", grade: "", avatarId: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResponse, avatarResponse] = await Promise.all([
          fetch(`${API_URL}/students/me`, { credentials: "include" }),
          fetch(`${API_URL}/avatars`, { credentials: "include" }),
        ]);
        const profileData = await profileResponse.json();
        const avatarData = await avatarResponse.json();

        if (profileResponse.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!profileResponse.ok || !profileData.success) {
          throw new Error(profileData.message || "Unable to load profile");
        }

        setProfile(profileData.student);
        setForm({
          name: profileData.student.name || "",
          email: profileData.student.email || "",
          grade: String(profileData.student.grade?.number || ""),
          avatarId: profileData.student.avatar?.id || "",
        });
        if (avatarResponse.ok && avatarData.success) setAvatars(avatarData.avatars);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students/me`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          grade: Number(form.grade),
          avatarId: form.avatarId || null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(Object.values(data.errors || {}).flat().join(" ") || data.message || "Unable to update profile");
      }

      setProfile((current) => ({
        ...current,
        ...data.student,
      }));
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Delete your student account? This permanently removes your profile and learning progress.")) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students/me`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete account");
      }

      navigate("/register", { replace: true });
    } catch (deleteError) {
      setError(deleteError.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <main className="pf-loading">Loading profile...</main>
      </>
    );
  }

  const currentAvatar = avatars.find((a) => String(a.id) === String(form.avatarId));
  const heroEmoji = tutorEmoji[currentAvatar?.name || profile?.avatar?.name] || "🎓";

  return (
    <main className="pf-page">
      <style>{styles}</style>

      {/* Decorative shapes from the About section */}
      <motion.div
        className="pf-shape sun"
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <motion.img src={sunImage} alt="" animate={{ y: [0, -14, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
      <div className="pf-shape star">
        <motion.img src={starImage} alt="" animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <div className="pf-shape love">
        <motion.img src={loveImage} alt="" animate={{ x: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <motion.div
        className="pf-wrap"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <Link to="/dashboard" className="pf-back">
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        {/* Hero */}
        <div className="pf-hero">
          <div className="pf-avatar" aria-hidden="true">{heroEmoji}</div>
          <div>
            <h1>{profile?.name || "My Profile"}</h1>
            <p>Keep your details and tutor up to date.</p>
            <div className="pf-chips">
              {profile?.grade?.number && (
                <span className="pf-chip"><GraduationCap size={14} /> Grade {profile.grade.number}</span>
              )}
              {profile?.avatar?.name && (
                <span className="pf-chip">{tutorEmoji[profile.avatar.name] || "🎓"} Tutor: {profile.avatar.name}</span>
              )}
              {profile?.createdAt && (
                <span className="pf-chip">
                  <CalendarDays size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pf-card">
          {error && <div role="alert" className="pf-alert error">{error}</div>}
          {message && <div role="status" className="pf-alert success"><Check size={18} /> {message}</div>}

          <form onSubmit={saveProfile}>
            {/* Details */}
            <section className="pf-section">
              <h2>Your details</h2>
              <p>This is how your name and email appear on your account.</p>
              <div className="pf-grid">
                <label className="pf-field">
                  Student name
                  <span className="pf-input-wrap">
                    <User size={18} />
                    <input
                      className="pf-input"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </span>
                </label>

                <label className="pf-field">
                  Email
                  <span className="pf-input-wrap">
                    <Mail size={18} />
                    <input
                      className="pf-input"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      required
                    />
                  </span>
                </label>
              </div>
            </section>

            {/* Grade */}
            <section className="pf-section">
              <h2>Grade</h2>
              <p>Lessons and practice match the grade you pick.</p>
              <div className="pf-grades" role="radiogroup" aria-label="Grade">
                {[1, 2, 3, 4, 5, 6].map((grade) => {
                  const active = form.grade === String(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`pf-grade ${active ? "active" : ""}`}
                      onClick={() => setForm({ ...form, grade: String(grade) })}
                    >
                      {grade}
                      <small>Grade</small>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Tutor */}
            <section className="pf-section">
              <h2>Tutor avatar</h2>
              <p>Choose the friend who explains maths with you.</p>
              <div className="pf-tutors" role="radiogroup" aria-label="Tutor avatar">
                {avatars.map((avatar) => {
                  const active = String(form.avatarId) === String(avatar.id);
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`pf-tutor ${active ? "active" : ""}`}
                      onClick={() => setForm({ ...form, avatarId: active ? "" : avatar.id })}
                    >
                      {active && <span className="tick"><Check size={14} /></span>}
                      <span className="emoji">{tutorEmoji[avatar.name] || "🎓"}</span>
                      <span className="name">{avatar.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="pf-actions">
              <button type="submit" disabled={saving} className="pf-btn primary">
                <Save size={18} />
                {saving ? "Saving..." : "Save profile"}
              </button>
              <button type="button" disabled={saving} onClick={deleteProfile} className="pf-btn danger">
                <Trash2 size={18} />
                Delete account
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
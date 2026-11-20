import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

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

  if (loading) return <main style={{ padding: "48px", textAlign: "center" }}>Loading profile...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-page)", color: "var(--color-text)", padding: "48px 20px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div>
            <p style={{ margin: "0 0 4px", color: "var(--color-text)" }}>Student profile</p>
            <h1 style={{ margin: 0 }}>{profile?.name || "My Profile"}</h1>
          </div>
          <Link to="/dashboard" style={{ color: "var(--color-link)", fontWeight: 700 }}>Back to dashboard</Link>
        </div>

        {error && <p role="alert" style={{ color: "var(--color-error-text)" }}>{error}</p>}
        {message && <p role="status" style={{ color: "var(--color-success-text)" }}>{message}</p>}

        <form onSubmit={saveProfile} style={{ display: "grid", gap: "18px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            Student name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} maxLength={100} style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--color-border)" }} />
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--color-border)" }} />
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            Grade
            <select value={form.grade} onChange={(event) => setForm({ ...form, grade: event.target.value })} required style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
              <option value="">Select grade</option>
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            Tutor avatar
            <select value={form.avatarId} onChange={(event) => setForm({ ...form, avatarId: event.target.value })} style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
              <option value="">No avatar selected</option>
              {avatars.map((avatar) => (
                <option key={avatar.id} value={avatar.id}>{avatar.name}</option>
              ))}
            </select>
          </label>

          {profile?.createdAt && (
            <p style={{ color: "var(--color-text)", margin: 0 }}>
              Account created: {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          )}

          <button type="submit" disabled={saving} style={{ border: 0, borderRadius: "10px", padding: "13px 18px", background: "var(--color-primary)", color: "var(--color-on-primary)", fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            {saving ? "Saving..." : "Save profile"}
          </button>
          <button type="button" disabled={saving} onClick={deleteProfile} style={{ border: "1px solid var(--color-error)", borderRadius: "10px", padding: "13px 18px", background: "transparent", color: "var(--color-error-text)", fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
            Delete account
          </button>
        </form>
      </div>
    </main>
  );
}

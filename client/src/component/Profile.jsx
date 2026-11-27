import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  CalendarDays,
  Save,
  Trash2,
  Check,
  Sparkles,
  History,
  MessageSquare,
  Search,
SlidersHorizontal,
ArrowUpDown,
X,
BookOpen,
} from "lucide-react";
import { API_URL } from "../config/api";

import sunImage from "../assets/img/about/sun.png";
import starImage from "../assets/img/about/star.png";
import loveImage from "../assets/img/about/love.png";
import equationImage from "../assets/img/profile/equation.gif";
import kangarooImage from "../assets/img/team/kanga.jpeg";
import pandaImage from "../assets/img/team/panda.png";
import koalaImage from "../assets/img/team/Koala3.png";

const easeOut = [0.25, 0.1, 0.25, 1];

const tutorImages = {
  Kangaroo: kangarooImage,
  Panda: pandaImage,
  Koala: koalaImage,
};
const [historySearch, setHistorySearch] = useState("");
const [historyDateFilter, setHistoryDateFilter] = useState("all");
const [historyTutorFilter, setHistoryTutorFilter] = useState("all");
const [historySort, setHistorySort] = useState("newest");
const formatHistoryMessage = (message) => {
  if (message.role !== "assistant") return message.content;

  try {
    const tutor = JSON.parse(message.content);
    if (!tutor || typeof tutor !== "object") return message.content;

    return [
      tutor.message,
      ...(Array.isArray(tutor.steps)
        ? tutor.steps.map((step) =>
            [step.explanation, step.calculation].filter(Boolean).join(" ")
          )
        : []),
      tutor.answer && `Answer: ${tutor.answer}`,
      tutor.hint && `Hint: ${tutor.hint}`,
      tutor.encouragement,
      tutor.topic && `Topic: ${tutor.topic}`,
      tutor.difficulty && `Difficulty: ${tutor.difficulty}`,
    ]
      .filter(Boolean)
      .join("\n\n") || message.content;
  } catch {
    return message.content;
  }
};

const styles = `
  .pf-page {
    position: relative;
    min-height: 100vh;
    padding: 36px 20px 72px;
    background: var(--color-page);
    color: var(--color-ink);
    overflow: hidden;
  }
  .pf-shape { position: absolute; pointer-events: none; z-index: 0; }
  .pf-shape img { width: 100%; height: auto; display: block; }
  .pf-shape.sun  { top: 35px; right: 5%; width: 72px; opacity: .55; }
  .pf-shape.star { bottom: 90px; left: 4%; width: 48px; opacity: .45; }
  .pf-shape.love { top: 48%; right: 2%; width: 44px; opacity: .4; }
  .pf-wrap { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; }

  .pf-back {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 24px;
    border: 1px solid var(--color-border);
    background: var(--color-surface); color: var(--color-ink); font-weight: 700; font-size: 14px;
    text-decoration: none; box-shadow: var(--shadow-card);
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .pf-back:hover { transform: translateX(-3px); box-shadow: 0 8px 22px var(--color-shadow); }
  .pf-top-links { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .pf-history-shortcut {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 24px;
    border: 1px solid var(--color-border); background: var(--color-surface);
    color: var(--color-link); font-size: 14px; font-weight: 800;
    text-decoration: none; box-shadow: var(--shadow-card);
  }
  .pf-history-shortcut:hover { border-color: var(--color-primary); }

  .pf-heading { margin: 26px 0 22px; }
  .pf-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    color: var(--color-link); font-size: 11px; font-weight: 800;
    letter-spacing: .12em; text-transform: uppercase;
  }
  .pf-heading h1 { margin: 8px 0 4px; font-size: clamp(30px, 4vw, 42px); line-height: 1.12; }
  .pf-heading > p { margin: 0; color: var(--color-text); font-size: 16px; }

  .pf-hero {
    position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 260px;
    align-items: center; gap: 24px; overflow: hidden;
    padding: 26px 34px; margin-bottom: 22px;
    border: 1px solid var(--color-border); border-radius: 24px;
    background: var(--color-surface); box-shadow: var(--shadow-card);
  }
  .pf-hero-copy { position: relative; z-index: 1; }
  .pf-hero-copy h2 { margin: 0 0 7px; font-size: 21px; }
  .pf-hero-copy p { margin: 0; color: var(--color-text); line-height: 1.6; }
  .pf-hero-art {
    display: grid; min-height: 112px; place-items: center;
    border-radius: 18px; background: var(--color-surface-soft);
  }
  .pf-hero-art img { display: block; width: 100%; max-width: 240px; height: auto; mix-blend-mode: multiply; }

  .pf-overview {
    display: flex; align-items: center; gap: 18px;
    padding: 18px 22px; margin-bottom: 22px;
    border: 1px solid var(--color-border); border-radius: 20px;
    background: var(--color-primary-soft);
  }
  .pf-tutor-portrait {
    display: grid; flex: none; width: 76px; height: 76px;
    place-items: center; overflow: hidden; border-radius: 22px;
    background: var(--color-surface);
  }
  .pf-tutor-portrait img { width: 100%; height: 100%; object-fit: contain; }
  .pf-overview-copy { min-width: 0; }
  .pf-overview-copy > span { color: var(--color-text); font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
  .pf-overview-copy h2 { margin: 3px 0 8px; font-size: 21px; }
  .pf-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .pf-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 11px; border-radius: 999px; font-size: 12px; font-weight: 700;
    background: var(--color-surface); color: var(--color-ink);
  }

  .pf-form-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 20px; }
  .pf-card {
    min-width: 0; padding: 26px;
    border: 1px solid var(--color-border); border-radius: 22px;
    background: var(--color-surface); box-shadow: var(--shadow-card);
  }
  .pf-section-heading { margin-bottom: 20px; }
  .pf-section-heading h2 { margin: 0 0 5px; font-size: 19px; }
  .pf-section-heading p { margin: 0; color: var(--color-text); font-size: 13px; line-height: 1.5; }
  .pf-fields { display: grid; gap: 17px; }
  .pf-field { display: grid; gap: 7px; color: var(--color-ink); font-size: 13px; font-weight: 700; }
  .pf-input-wrap { position: relative; }
  .pf-input-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-text); }
  .pf-input {
    display: block; width: 100%; min-height: 48px; padding: 11px 14px 11px 42px;
    border: 1px solid var(--color-border); border-radius: 12px;
    background: var(--color-surface); color: var(--color-ink);
    font: inherit; font-size: 14px;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .pf-input:focus { outline: 3px solid var(--color-focus); outline-offset: 2px; border-color: var(--color-primary); }

  .pf-grade-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }
  .pf-grade {
    min-height: 56px; padding: 8px; border: 1px solid var(--color-border);
    border-radius: 13px; background: var(--color-surface); color: var(--color-ink);
    cursor: pointer; font: inherit; font-size: 17px; font-weight: 800;
    transition: transform .15s ease, border-color .15s ease, background .15s ease;
  }
  .pf-grade:hover { transform: translateY(-2px); }
  .pf-grade.active { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-on-primary); }
  .pf-grade:focus-visible, .pf-tutor:focus-visible, .pf-btn:focus-visible, .pf-delete:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }

  .pf-tutors { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .pf-tutor {
    position: relative; display: flex; min-width: 0; flex-direction: column; align-items: center; gap: 8px;
    padding: 12px 9px; border: 1px solid var(--color-border); border-radius: 16px;
    background: var(--color-surface); color: var(--color-ink); cursor: pointer;
    font: inherit; text-align: center;
    transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
  }
  .pf-tutor:hover { transform: translateY(-3px); }
  .pf-tutor img { display: block; width: 100%; height: 96px; object-fit: contain; border-radius: 11px; background: var(--color-surface-soft); }
  .pf-tutor .name { font-size: 13px; font-weight: 800; }
  .pf-tutor .personality { color: var(--color-text); font-size: 11px; line-height: 1.4; }
  .pf-tutor.active { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft); }
  .pf-tutor .tick {
    position: absolute; top: 8px; right: 8px; width: 23px; height: 23px; border-radius: 50%;
    display: grid; place-items: center; background: var(--color-primary); color: var(--color-on-primary);
  }

  .pf-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
  .pf-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 46px; padding: 11px 18px; border: 1px solid transparent;
    border-radius: 13px; font: inherit; font-weight: 800; font-size: 14px; cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
  }
  .pf-btn:disabled { opacity: .55; cursor: not-allowed; }
  .pf-btn:not(:disabled):hover { transform: translateY(-2px); }
  .pf-btn.primary { background: var(--color-primary); color: var(--color-on-primary); box-shadow: var(--shadow-card); }
  .pf-btn.secondary { border-color: var(--color-border); background: var(--color-surface); color: var(--color-link); }
  .pf-danger-zone {
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    margin-top: 20px; padding: 20px 24px;
    border: 1px solid var(--color-error-soft); border-radius: 18px;
    background: var(--color-surface);
  }
  .pf-danger-zone h2 { margin: 0 0 4px; font-size: 15px; color: var(--color-error-text); }
  .pf-danger-zone p { margin: 0; color: var(--color-text); font-size: 12px; line-height: 1.5; }
  .pf-delete { flex: none; border: 1px solid var(--color-error); background: var(--color-surface); color: var(--color-error-text); }
  .pf-alert {
    display: flex; align-items: flex-start; gap: 10px; padding: 12px 15px;
    margin: 0 0 16px; border-radius: 12px; font-size: 13px; font-weight: 700;
  }
  .pf-alert.error { background: var(--color-error-soft); color: var(--color-error-text); }
  .pf-alert.success { background: var(--color-success-soft); color: var(--color-success-text); }
  .pf-alert svg { flex: none; }
  .pf-loading {
    min-height: 100vh; display: grid; place-items: center;
    background: var(--color-page); color: var(--color-text); font-weight: 700;
  }
  .pf-retry { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .pf-retry button { border: 0; background: var(--color-primary); color: var(--color-on-primary); }
  .pf-history-section {
    margin-top: 24px; padding: 26px;
    border: 1px solid var(--color-border); border-radius: 22px;
    background: var(--color-surface); box-shadow: var(--shadow-card);
  }
  .pf-history-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 20px; }
  .pf-history-heading h2 { margin: 0 0 5px; font-size: 20px; }
  .pf-history-heading p { margin: 0; color: var(--color-text); font-size: 13px; line-height: 1.5; }
  .pf-history-group + .pf-history-group { margin-top: 24px; }
  .pf-history-group h3 { margin: 0 0 12px; font-size: 15px; }
  .pf-avatar-history { display: flex; flex-wrap: wrap; gap: 10px; }
  .pf-avatar-history-item {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 8px 12px; border: 1px solid var(--color-border);
    border-radius: 14px; background: var(--color-page); color: var(--color-ink);
    font-size: 12px; font-weight: 700;
  }
  .pf-avatar-history-item img { width: 34px; height: 34px; object-fit: contain; border-radius: 9px; background: var(--color-surface); }
  .pf-avatar-history-item time { display: block; margin-top: 2px; color: var(--color-text); font-size: 10px; font-weight: 500; }
  .pf-history-list { display: grid; gap: 12px; }
  .pf-history-item { border: 1px solid var(--color-border); border-radius: 15px; overflow: hidden; }
  .pf-history-item summary {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
    padding: 14px 16px; background: var(--color-page); cursor: pointer; list-style: none;
  }
  .pf-history-item summary::-webkit-details-marker { display: none; }
  .pf-history-item summary:hover { background: var(--color-primary-soft); }
  .pf-history-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .pf-history-title img { width: 42px; height: 42px; flex: none; object-fit: contain; border-radius: 11px; background: var(--color-surface); }
  .pf-history-title strong, .pf-history-title small { display: block; }
  .pf-history-title strong { font-size: 14px; }
  .pf-history-title small { margin-top: 3px; color: var(--color-text); font-size: 11px; }
  .pf-history-count { flex: none; color: var(--color-link); font-size: 12px; font-weight: 800; }
  .pf-history-messages { display: grid; gap: 10px; padding: 14px; }
  .pf-history-message { padding: 12px 14px; border-radius: 12px; background: var(--color-page); }
  .pf-history-message.student { background: var(--color-primary-soft); }
  .pf-history-message strong { display: block; margin-bottom: 5px; font-size: 11px; }
  .pf-history-message p { margin: 0; color: var(--color-ink); font-size: 13px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
  .pf-history-message time { display: block; margin-top: 7px; color: var(--color-text); font-size: 10px; }
  .pf-history-empty { margin: 0; padding: 16px; border-radius: 12px; background: var(--color-page); color: var(--color-text); font-size: 13px; }

  .pf-history-section {
  margin-top: 24px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.pf-history-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
  margin: 22px 0;
}

.pf-history-stat {
  padding: 17px;
  border: 1px solid var(--color-border);
  border-radius: 17px;
  background: var(--color-surface-soft);
}

.pf-history-stat .stat-icon {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  margin-bottom: 12px;
  border-radius: 11px;
}

.pf-history-stat.blue .stat-icon {
  background: #e4efff;
  color: #3478db;
}

.pf-history-stat.green .stat-icon {
  background: #e1f7eb;
  color: #219b62;
}

.pf-history-stat.purple .stat-icon {
  background: #f0e9ff;
  color: #8756d6;
}

.pf-history-stat strong {
  display: block;
  font-size: 25px;
  font-weight: 850;
}

.pf-history-stat span {
  color: var(--color-text);
  font-size: 12px;
}

.pf-history-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px 180px;
  gap: 11px;
  margin: 20px 0 13px;
}

.pf-history-search {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  background: var(--color-page);
  color: var(--color-text);
}

.pf-history-search input {
  width: 100%;
  min-width: 0;
  height: 46px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--color-ink);
  font: inherit;
  font-size: 13px;
}

.pf-history-select {
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  background: var(--color-page);
  color: var(--color-ink);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.pf-history-select:focus,
.pf-history-search:focus-within {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-focus);
}

.pf-history-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0 23px;
}

.pf-filter-btn {
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 30px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s ease;
}

.pf-filter-btn:hover {
  border-color: var(--color-primary);
}

.pf-filter-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.pf-clear-filters {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: var(--color-link);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.pf-history-results {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.pf-history-results strong {
  font-size: 15px;
}

.pf-history-results span {
  color: var(--color-text);
  font-size: 12px;
}

.pf-history-item {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-surface);
  transition: border-color .2s ease, box-shadow .2s ease;
}

.pf-history-item[open] {
  border-color: var(--color-primary);
  box-shadow: 0 5px 20px var(--color-shadow);
}

.pf-history-item summary {
  background: var(--color-surface-soft);
  transition: background .2s ease;
}

.pf-history-item summary:hover {
  background: var(--color-primary-soft);
}

.pf-history-item[open] summary {
  background: var(--color-primary-soft);
}

.pf-history-count {
  padding: 6px 10px;
  border-radius: 20px;
  background: var(--color-primary-soft);
  color: var(--color-link);
  font-size: 11px;
  font-weight: 800;
}

.pf-history-empty {
  padding: 35px 18px;
  border: 1px dashed var(--color-border);
  border-radius: 15px;
  background: var(--color-surface-soft);
  color: var(--color-text);
  text-align: center;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .pf-history-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .pf-history-search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .pf-history-stats {
    gap: 8px;
  }

  .pf-history-stat {
    padding: 11px;
  }

  .pf-history-stat strong {
    font-size: 20px;
  }

  .pf-history-stat span {
    font-size: 10px;
  }

  .pf-history-toolbar {
    grid-template-columns: 1fr;
  }

  .pf-history-search {
    grid-column: auto;
  }
}

  @media (max-width: 800px) {
    .pf-page { padding: 26px 16px 48px; }
    .pf-hero { grid-template-columns: minmax(0, 1fr) 190px; padding: 22px; }
    .pf-form-grid { grid-template-columns: 1fr; }
    .pf-card { padding: 22px; }
  }
  @media (max-width: 560px) {
    .pf-page { padding: 18px 13px 36px; }
    .pf-heading { margin: 22px 0 18px; }
    .pf-heading > p { font-size: 14px; }
    .pf-top-links { align-items: stretch; }
    .pf-back, .pf-history-shortcut { justify-content: center; padding: 9px 11px; font-size: 12px; }
    .pf-hero { grid-template-columns: 1fr; padding: 20px; gap: 15px; }
    .pf-hero-art { min-height: 76px; }
    .pf-hero-art img { max-width: 200px; }
    .pf-overview { align-items: flex-start; padding: 15px; gap: 12px; }
    .pf-tutor-portrait { width: 58px; height: 58px; border-radius: 16px; }
    .pf-overview-copy h2 { font-size: 17px; }
    .pf-chip { font-size: 11px; }
    .pf-card { padding: 18px; border-radius: 18px; }
    .pf-history-section { padding: 18px; border-radius: 18px; }
    .pf-history-heading { flex-direction: column; }
    .pf-history-item summary { align-items: flex-start; padding: 12px; }
    .pf-history-title img { width: 36px; height: 36px; }
    .pf-tutors { gap: 7px; }
    .pf-tutor { padding: 8px 6px; }
    .pf-tutor img { height: 72px; }
    .pf-tutor .personality { font-size: 10px; }
    .pf-actions { flex-direction: column; }
    .pf-actions .pf-btn { width: 100%; }
    .pf-danger-zone { align-items: stretch; flex-direction: column; padding: 17px; }
    .pf-danger-zone .pf-btn { width: 100%; }
    .pf-shape.sun, .pf-shape.love { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pf-page *, .pf-page *::before, .pf-page *::after {
      transition-duration: .01ms !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
    }
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
  const [loadRetry, setLoadRetry] = useState(0);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [historyRetry, setHistoryRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileResponse, avatarResponse] = await Promise.all([
          fetch(`${API_URL}/students/me`, { credentials: "include", signal: controller.signal }),
          fetch(`${API_URL}/avatars`, { credentials: "include", signal: controller.signal }),
        ]);

        if (profileResponse.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const profileData = await profileResponse.json();
        if (!profileResponse.ok || !profileData.success) {
          throw new Error(profileData.message || "Unable to load profile");
        }

        const avatarData = await avatarResponse.json();
        if (!avatarResponse.ok || !avatarData.success) {
          throw new Error(avatarData.message || "Unable to load tutor choices");
        }

        if (!active) return;
        const student = profileData.student;
        setProfile(student);
        setForm({
          name: student.name || "",
          email: student.email || "",
          grade: String(student.grade?.number || ""),
          avatarId: student.avatar?.id || "",
        });
        setAvatars(avatarData.avatars);
      } catch (loadError) {
        if (loadError.name !== "AbortError" && active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
      controller.abort();
    };
  }, [navigate, loadRetry]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadHistory = async () => {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const response = await fetch(`${API_URL}/conversations/history`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load conversation history");
        }

        if (active) setHistory(data);
      } catch (loadError) {
        if (loadError.name !== "AbortError" && active) {
          setHistoryError(loadError.message);
        }
      } finally {
        if (active) setHistoryLoading(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
      controller.abort();
    };
  }, [navigate, historyRetry]);

  const saveProfile = async (event) => {
    event.preventDefault();
    if (saving) return;
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
      setForm({
        name: data.student.name || "",
        email: data.student.email || "",
        grade: String(data.student.grade?.number || ""),
        avatarId: data.student.avatar?.id || "",
      });
      const selectedTutorId = {
        Kangaroo: "kanga",
        Panda: "pandy",
        Koala: "koala",
      }[data.student.avatar?.name] || "kanga";
      localStorage.setItem("selectedTutorId", selectedTutorId);
      setMessage("Profile updated successfully.");
      setHistoryRetry((attempt) => attempt + 1);
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

  const resetForm = () => {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      grade: String(profile.grade?.number || ""),
      avatarId: profile.avatar?.id || "",
    });
    setError("");
    setMessage("");
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <main className="pf-loading">Loading profile...</main>
      </>
    );
  }

  if (!profile) {
    return (
      <main className="pf-page">
        <style>{styles}</style>
        <div className="pf-wrap">
          <div className="pf-top-links">
            <Link to="/start-learning" className="pf-back">
              <ArrowLeft size={18} />
              Back to learning
            </Link>
            <a href="#conversation-history" className="pf-history-shortcut">
              <History size={17} />
              Conversation history
            </a>
          </div>
          <div className="pf-heading">
            <span className="pf-eyebrow"><Sparkles size={14} /> YOUR NUMORA ACCOUNT</span>
            <h1>Your profile</h1>
          </div>
          <div className="pf-alert error" role="alert">
            <span>{error || "Your profile could not be loaded."}</span>
          </div>
          <div className="pf-retry">
            <button type="button" className="pf-btn" onClick={() => setLoadRetry((attempt) => attempt + 1)}>
              Try again
            </button>
            <span>Check your connection and try loading your account again.</span>
          </div>
        </div>
      </main>
    );
  }

  const currentAvatar =
    avatars.find((avatar) => String(avatar.id) === String(form.avatarId)) ||
    profile.avatar;
  const currentAvatarImage =
    currentAvatar?.imageUrl || tutorImages[currentAvatar?.name];
  const hasChanges = Boolean(
    form.name !== (profile.name || "") ||
    form.email !== (profile.email || "") ||
    form.grade !== String(profile.grade?.number || "") ||
    String(form.avatarId) !== String(profile.avatar?.id || "")
  );
const conversations = history?.conversations || [];

const tutorOptions = [
  ...new Set(
    conversations
      .map((conversation) => conversation.avatar?.name)
      .filter(Boolean)
  ),
];

const filteredConversations = conversations
  .filter((conversation) => {
    const search = historySearch.trim().toLowerCase();

    const searchableText = [
      conversation.title,
      conversation.avatar?.name,
      ...(conversation.messages || []).map((message) =>
        formatHistoryMessage(message)
      ),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || searchableText.includes(search);

    const conversationDate = new Date(conversation.updatedAt);
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const matchesDate =
      historyDateFilter === "all" ||
      (historyDateFilter === "today" &&
        conversationDate >= startOfToday) ||
      (historyDateFilter === "week" &&
        conversationDate >= startOfWeek) ||
      (historyDateFilter === "month" &&
        conversationDate >= startOfMonth);

    const matchesTutor =
      historyTutorFilter === "all" ||
      conversation.avatar?.name === historyTutorFilter;

    return matchesSearch && matchesDate && matchesTutor;
  })
  .sort((a, b) => {
    const difference =
      new Date(b.updatedAt) - new Date(a.updatedAt);

    return historySort === "newest" ? difference : -difference;
  });

const conversationsThisWeek = conversations.filter((conversation) => {
  const date = new Date(conversation.updatedAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return date >= sevenDaysAgo;
}).length;

const hasActiveFilters =
  historySearch.trim() !== "" ||
  historyDateFilter !== "all" ||
  historyTutorFilter !== "all";
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
        <Link to="/start-learning" className="pf-back">
          <ArrowLeft size={18} />
          Back to learning
        </Link>

        <header className="pf-heading">
          <span className="pf-eyebrow"><Sparkles size={14} /> YOUR NUMORA ACCOUNT</span>
          <h1>Your profile</h1>
          <p>Keep your learning details and tutor up to date.</p>
        </header>

        <section className="pf-hero" aria-label="Profile introduction">
          <div className="pf-hero-copy">
            <h2>Make this learning space yours.</h2>
            <p>Update your details, choose your school grade, and pick the tutor who learns alongside you.</p>
          </div>
          <div className="pf-hero-art">
            <img src={equationImage} alt="" />
          </div>
        </section>

        <section className="pf-overview" aria-label="Current learning profile">
          <div className="pf-tutor-portrait">
            {currentAvatarImage ? (
              <img src={currentAvatarImage} alt={currentAvatar?.name ? `${currentAvatar.name} tutor` : ""} />
            ) : (
              <User size={30} aria-hidden="true" />
            )}
          </div>
          <div className="pf-overview-copy">
            <span>Your learning profile</span>
            <h2>{profile.name}</h2>
            <div className="pf-chips">
              <span className="pf-chip"><GraduationCap size={14} /> Grade {profile.grade?.number}</span>
              <span className="pf-chip">
                {currentAvatar?.name ? `Tutor: ${currentAvatar.name}` : "Choose your tutor below"}
              </span>
              {profile.createdAt && (
                <span className="pf-chip">
                  <CalendarDays size={14} />
                  Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </section>

        {error && <div role="alert" className="pf-alert error">{error}</div>}
        {message && <div role="status" className="pf-alert success"><Check size={18} /> {message}</div>}

        <form onSubmit={saveProfile}>
          <div className="pf-form-grid">
            <section className="pf-card">
              <div className="pf-section-heading">
                <h2>Your details</h2>
                <p>These are the account details attached to your learning.</p>
              </div>
              <div className="pf-fields">
                <label className="pf-field">
                  Student name
                  <span className="pf-input-wrap">
                    <User size={18} />
                    <input
                      className="pf-input"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
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
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      required
                      maxLength={254}
                    />
                  </span>
                </label>
              </div>
            </section>

            <div className="pf-card pf-preferences">
              <section>
                <div className="pf-section-heading">
                  <h2>School grade</h2>
                  <p>Your lessons and practice are tailored to this grade.</p>
                </div>
                <div className="pf-grade-grid" role="radiogroup" aria-label="School grade">
                  {[1, 2, 3, 4, 5, 6].map((grade) => {
                    const active = form.grade === String(grade);
                    return (
                      <button
                        key={grade}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`pf-grade ${active ? "active" : ""}`}
                        onClick={() => setForm((current) => ({ ...current, grade: String(grade) }))}
                      >
                        {grade}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="pf-tutor-section">
                <div className="pf-section-heading">
                  <h2>Choose your tutor</h2>
                  <p>Pick a friendly face to guide you through maths.</p>
                </div>
                <div className="pf-tutors" role="radiogroup" aria-label="Choose your tutor">
                  {avatars.map((avatar) => {
                    const active = String(form.avatarId) === String(avatar.id);
                    const image = avatar.imageUrl || tutorImages[avatar.name];
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={`Choose ${avatar.name}`}
                        className={`pf-tutor ${active ? "active" : ""}`}
                        onClick={() => setForm((current) => ({ ...current, avatarId: avatar.id }))}
                      >
                        {active && <span className="tick"><Check size={14} /></span>}
                        {image && <img src={image} alt="" />}
                        <span className="name">{avatar.name}</span>
                        <span className="personality">{avatar.personality}</span>
                      </button>
                    );
                  })}
                </div>
                {!avatars.length && (
                  <div className="pf-alert error" role="status">No tutor choices are available right now.</div>
                )}
              </section>
            </div>
          </div>

          <div className="pf-actions">
            <button type="submit" disabled={saving || !hasChanges} className="pf-btn primary">
              <Save size={18} />
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button type="button" disabled={saving || !hasChanges} onClick={resetForm} className="pf-btn secondary">
              Discard changes
            </button>
          </div>
        </form>

        <section className="pf-history-section" id="conversation-history">
          <div className="pf-history-heading">
            <div>
              <h2>Conversation history</h2>
              <p>Review your previous maths chats and the tutors you chose.</p>
            </div>
            {history && (
              <span className="pf-chip">
                <MessageSquare size={14} />
                {history.conversations.length} conversations
              </span>
            )}
          </div>

          {historyLoading && <p className="pf-history-empty">Loading your conversation history...</p>}
          {historyError && (
            <div className="pf-alert error" role="alert">
              <span>{historyError}</span>
              <button type="button" className="pf-btn secondary" onClick={() => setHistoryRetry((attempt) => attempt + 1)}>
                Try again
              </button>
            </div>
          )}

          {!historyLoading && !historyError && history && (
            <>
              <div className="pf-history-group">
                <h3>Avatars you have chosen</h3>
                {history.avatarSelections.length ? (
                  <div className="pf-avatar-history">
                    {history.avatarSelections.map((selection) => {
                      const image = selection.avatar.imageUrl || tutorImages[selection.avatar.name];
                      return (
                        <div className="pf-avatar-history-item" key={selection.id}>
                          {image && <img src={image} alt="" />}
                          <span>
                            {selection.avatar.name}
                            <time>{new Date(selection.selectedAt).toLocaleString()}</time>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="pf-history-empty">No past avatar changes have been recorded yet.</p>
                )}
              </div>

             <div className="pf-history-group">
  <div className="pf-section-heading">
    <h3>Past conversations</h3>
    <p>Search, filter, and revisit your previous learning sessions.</p>
  </div>

  <div className="pf-history-stats">
    <div className="pf-history-stat blue">
      <div className="stat-icon">
        <MessageSquare size={18} />
      </div>
      <strong>{conversations.length}</strong>
      <span>Total conversations</span>
    </div>

    <div className="pf-history-stat green">
      <div className="stat-icon">
        <CalendarDays size={18} />
      </div>
      <strong>{conversationsThisWeek}</strong>
      <span>Last 7 days</span>
    </div>

    <div className="pf-history-stat purple">
      <div className="stat-icon">
        <User size={18} />
      </div>
      <strong>{tutorOptions.length}</strong>
      <span>Tutors used</span>
    </div>
  </div>

  <div className="pf-history-toolbar">
    <div className="pf-history-search">
      <Search size={18} />
      <input
        type="search"
        placeholder="Search topics, messages..."
        value={historySearch}
        onChange={(event) => setHistorySearch(event.target.value)}
        aria-label="Search conversations"
      />
      {historySearch && (
        <button
          type="button"
          className="pf-clear-filters"
          onClick={() => setHistorySearch("")}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>

    <select
      className="pf-history-select"
      value={historyTutorFilter}
      onChange={(event) => setHistoryTutorFilter(event.target.value)}
      aria-label="Filter by tutor"
    >
      <option value="all">All tutors</option>
      {tutorOptions.map((tutor) => (
        <option key={tutor} value={tutor}>
          {tutor}
        </option>
      ))}
    </select>

    <select
      className="pf-history-select"
      value={historySort}
      onChange={(event) => setHistorySort(event.target.value)}
      aria-label="Sort conversations"
    >
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>
  </div>

  <div className="pf-history-filters">
    <SlidersHorizontal size={16} />

    {[
      { label: "All time", value: "all" },
      { label: "Today", value: "today" },
      { label: "This week", value: "week" },
      { label: "This month", value: "month" },
    ].map((filter) => (
      <button
        key={filter.value}
        type="button"
        className={`pf-filter-btn ${
          historyDateFilter === filter.value ? "active" : ""
        }`}
        onClick={() => setHistoryDateFilter(filter.value)}
      >
        {filter.label}
      </button>
    ))}

    {hasActiveFilters && (
      <button
        type="button"
        className="pf-clear-filters"
        onClick={() => {
          setHistorySearch("");
          setHistoryDateFilter("all");
          setHistoryTutorFilter("all");
          setHistorySort("newest");
        }}
      >
        <X size={14} />
        Clear filters
      </button>
    )}
  </div>

  <div className="pf-history-results">
    <strong>Your conversations</strong>
    <span>
      Showing {filteredConversations.length} of {conversations.length}
    </span>
  </div>

  {filteredConversations.length ? (
    <div className="pf-history-list">
      {filteredConversations.map((conversation) => {
        const avatarName =
          conversation.avatar?.name || "Tutor not recorded";

        const avatarImage =
          conversation.avatar?.imageUrl ||
          tutorImages[conversation.avatar?.name];

        return (
          <details
            className="pf-history-item"
            key={conversation.id}
          >
            <summary>
              <span className="pf-history-title">
                {avatarImage && (
                  <img src={avatarImage} alt="" />
                )}

                <span>
                  <strong>
                    {conversation.title || "Math Tutor Session"}
                  </strong>

                  <small>
                    {avatarName} ·{" "}
                    {new Date(
                      conversation.updatedAt
                    ).toLocaleString()}
                  </small>
                </span>
              </span>

              <span className="pf-history-count">
                {conversation.messages.length} messages
              </span>
            </summary>

            <div className="pf-history-messages">
              {conversation.messages.map((chatMessage) => (
                <article
                  className={`pf-history-message ${
                    chatMessage.role === "user"
                      ? "student"
                      : "tutor"
                  }`}
                  key={chatMessage.id}
                >
                  <strong>
                    {chatMessage.role === "user"
                      ? profile.name
                      : avatarName}
                  </strong>

                  <p>{formatHistoryMessage(chatMessage)}</p>

                  <time>
                    {new Date(
                      chatMessage.createdAt
                    ).toLocaleString()}
                  </time>
                </article>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  ) : (
    <div className="pf-history-empty">
      <Search size={28} />
      <h3>No conversations found</h3>
      <p>
        Try changing your search or removing some filters
        to find your previous learning sessions.
      </p>

      <button
        type="button"
        className="pf-btn secondary"
        onClick={() => {
          setHistorySearch("");
          setHistoryDateFilter("all");
          setHistoryTutorFilter("all");
          setHistorySort("newest");
        }}
      >
        Reset filters
      </button>
    </div>
  )}
</div>
            </>
          )}
        </section>

        <section className="pf-danger-zone">
          <div>
            <h2>Delete account</h2>
            <p>Permanently delete your profile and saved learning progress.</p>
          </div>
          <button type="button" disabled={saving} onClick={deleteProfile} className="pf-btn pf-delete">
            <Trash2 size={17} />
            Delete account
          </button>
        </section>
      </motion.div>
    </main>
  );
}
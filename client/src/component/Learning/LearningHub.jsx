import { Link } from "react-router-dom";
import { Calculator, Shapes, BarChart3, Puzzle } from "lucide-react";

const subjects = [
  { name: "Algebra", path: "/Algebra", icon: Calculator, description: "Expressions, equations, and number patterns." },
  { name: "Measurement & Geometry", path: "/Measurement", icon: Shapes, description: "Shapes, area, perimeter, and measurement." },
  { name: "Statistics & Probability", path: "/Statistics", icon: BarChart3, description: "Data, graphs, averages, and chance." },
  { name: "Problem Solving", path: "/ProblemSolving", icon: Puzzle, description: "Real-world maths and step-by-step reasoning." },
];

export default function LearningHub() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 20px", background: "var(--color-page)", color: "var(--color-ink)" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <Link to="/dashboard" style={{ color: "var(--color-link)", fontWeight: 700 }}>← Dashboard</Link>
        <h1 style={{ margin: "18px 0 8px" }}>Choose a subject</h1>
        <p style={{ margin: "0 0 28px", color: "var(--color-text)" }}>Open lessons for your grade and learn with the AI tutor.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link key={subject.path} to={subject.path} style={{ textDecoration: "none", color: "inherit", padding: "22px", borderRadius: "18px", border: "1px solid var(--color-border)", background: "var(--color-surface)", boxShadow: "var(--shadow-card)" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "14px", display: "grid", placeItems: "center", background: "var(--color-primary)", color: "var(--color-on-primary)" }}>
                  <Icon size={21} />
                </div>
                <h2 style={{ fontSize: "18px", margin: "16px 0 8px" }}>{subject.name}</h2>
                <p style={{ margin: 0, color: "var(--color-text)", lineHeight: 1.5 }}>{subject.description}</p>
                <span style={{ display: "inline-flex", marginTop: "16px", color: "var(--color-link)", fontWeight: 700 }}>View lessons →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

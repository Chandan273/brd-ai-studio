"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bot, Check, ChevronDown, Copy, FileText, LoaderCircle, Play, Sparkles, Target, TriangleAlert } from "lucide-react";
import type { AgentKey, AgentOutput, BrdInput } from "@/lib/types";

const agents: { key: AgentKey; name: string; role: string; icon: typeof Bot; tone: string }[] = [
  { key: "analyst", name: "Requirements Agent", role: "Scope & success", icon: FileText, tone: "violet" },
  { key: "architect", name: "Solution Agent", role: "Design & delivery", icon: Bot, tone: "cyan" },
  { key: "risk", name: "Risk Agent", role: "Controls & gaps", icon: TriangleAlert, tone: "orange" },
];

const example: BrdInput = {
  projectName: "CareFlow Portal", industry: "Healthcare", problem: "Patients struggle to schedule appointments, retrieve test results, and get timely answers without calling the clinic.", users: "Patients, clinicians, clinic operations staff", goals: "Reduce appointment-related calls by 30%; increase digital self-service; improve patient satisfaction.", constraints: "HIPAA-aligned handling of health data, launch MVP in 12 weeks, integrate with existing EHR.",
};

function sample(agent: AgentKey, d: BrdInput) {
  const title = d.projectName || "Your project";
  if (agent === "analyst") return `## Business requirements\n\n**Problem to solve.** ${d.problem || "Define the core customer problem and its impact."}\n\n### Functional requirements\n- Users can complete the primary task through a simple, accessible flow.\n- Staff can view status and resolve exceptions in one workspace.\n- The solution captures an auditable history of key actions.\n\n### Success measures\n- Adoption by the target user group\n- Completion rate for the primary journey\n- Reduced manual effort for operations\n\n### Acceptance criteria\n- A target user can complete the core flow without staff assistance.\n- Error states explain the next action clearly.\n- Reporting is available for agreed success measures.`;
  if (agent === "architect") return `## Recommended solution\n\nBuild **${title}** as a responsive Next.js web application with a secure API layer and role-based access.\n\n### Delivery approach\n1. **Foundation:** authentication, user roles, core data model, monitoring.\n2. **MVP:** highest-value user journey and operational console.\n3. **Scale:** integrations, automated notifications, analytics.\n\n### Key components\n- Web experience for end users\n- Operations dashboard for internal teams\n- Integration service for the existing system of record\n- Event/audit log for traceability\n\n**Architecture decision:** define integration contracts early, keeping the core workflow operational if a downstream service is slow or unavailable.`;
  return `## Risks & governance\n\n### Principal risks\n| Risk | Mitigation | Owner |\n| --- | --- | --- |\n| Data exposure | Least-privilege access, encryption, audit logging | Security |\n| Integration delays | Sandbox early; clear API contract and fallback | Engineering |\n| Low adoption | Test prototypes with users before build | Product |\n\n### Dependencies\n- Access to the system of record and test environment\n- Named business owner for policy decisions\n- Legal/security review before production release\n\n### Open questions\n1. What is the approved retention policy?\n2. Which user roles need access at launch?\n3. What service level is expected for the core journey?`;
}

export default function BrdStudio() {
  const [form, setForm] = useState<BrdInput>(example);
  const [selected, setSelected] = useState<AgentKey>("analyst");
  const [outputs, setOutputs] = useState<Partial<Record<AgentKey, AgentOutput>>>({});
  const [loading, setLoading] = useState<AgentKey | null>(null);
  const [notice, setNotice] = useState("");
  const output = outputs[selected];
  const completion = useMemo(() => Math.round((Object.keys(outputs).length / agents.length) * 100), [outputs]);

  const update = (key: keyof BrdInput, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const runAgent = async (agent: AgentKey) => {
    setSelected(agent); setLoading(agent); setNotice("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, agent }) });
      const data = await response.json();
      const text = response.ok ? data.text : sample(agent, form);
      setOutputs((current) => ({ ...current, [agent]: { agent, title: agents.find((item) => item.key === agent)!.name, content: text } }));
      if (!response.ok) setNotice(`Demo output shown. Live AI error: ${data.error || "Unknown service error"}`);
    } catch {
      setOutputs((current) => ({ ...current, [agent]: { agent, title: agents.find((item) => item.key === agent)!.name, content: sample(agent, form) } }));
      setNotice("Demo output shown because the AI service is unavailable.");
    } finally { setLoading(null); }
  };
  const exportBrd = () => {
    const sections = agents.map((a) => `# ${a.name}\n\n${outputs[a.key]?.content || "Not generated"}`).join("\n\n---\n\n");
    const blob = new Blob([`# Business Requirements Document — ${form.projectName || "Untitled"}\n\n${sections}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${(form.projectName || "brd").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`; a.click(); URL.revokeObjectURL(url);
  };

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>BRD <b>AI</b></span></div>
      <nav><a className="nav-active"><FileText size={18} /> Project workspace</a><a><Target size={18} /> Templates</a></nav>
      <div className="sidebar-bottom"><div className="avatar">AR</div><div><strong>Alex Rivera</strong><small>Product lead</small></div><ChevronDown size={16} /></div>
    </aside>
    <section className="workspace">
      <header><div><p className="eyebrow">PROJECT / NEW BRD</p><h1>{form.projectName || "Untitled project"}</h1></div><button className="export" onClick={exportBrd}><Copy size={16} /> Export BRD</button></header>
      <div className="progress"><div><span>BRD readiness</span><strong>{completion}%</strong></div><div className="track"><i style={{ width: `${completion}%` }} /></div></div>
      <div className="layout">
        <section className="brief card"><div className="section-heading"><div><p className="eyebrow">01 / PROJECT BRIEF</p><h2>Give your agents context</h2></div><button className="ghost" onClick={() => setForm(example)}>Load example</button></div>
          <label>Project name<input value={form.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="e.g. Customer self-service portal" /></label>
          <label>Industry<select value={form.industry} onChange={(e) => update("industry", e.target.value)}><option>Healthcare</option><option>Financial services</option><option>Retail</option><option>Technology</option><option>Other</option></select></label>
          <label>What problem are you solving?<textarea value={form.problem} onChange={(e) => update("problem", e.target.value)} rows={3} /></label>
          <div className="two-col"><label>Primary users<textarea value={form.users} onChange={(e) => update("users", e.target.value)} rows={3} /></label><label>Business goals<textarea value={form.goals} onChange={(e) => update("goals", e.target.value)} rows={3} /></label></div>
          <label>Constraints & considerations<textarea value={form.constraints} onChange={(e) => update("constraints", e.target.value)} rows={3} /></label>
        </section>
        <section className="agents-area"><div className="agent-head"><div><p className="eyebrow">02 / AI WORKFORCE</p><h2>Ask your specialists</h2></div><button className="run-all" onClick={() => agents.reduce((chain, a) => chain.then(() => runAgent(a.key)), Promise.resolve())} disabled={!!loading}>{loading ? <LoaderCircle className="spin" size={16} /> : <Play size={15} />} Run all agents</button></div>
          <div className="agent-list">{agents.map((agent) => { const Icon = agent.icon; const done = !!outputs[agent.key]; return <button key={agent.key} className={`agent ${selected === agent.key ? "selected" : ""}`} onClick={() => runAgent(agent.key)} disabled={!!loading}><span className={`agent-icon ${agent.tone}`}><Icon size={19} /></span><span><b>{agent.name}</b><small>{agent.role}</small></span>{loading === agent.key ? <LoaderCircle className="spin" size={18} /> : done ? <span className="done"><Check size={14} /></span> : <ArrowRight size={17} />}</button>; })}</div>
          <article className="output card"><div className="output-top"><div><span className="live-dot" /> {output ? output.title : "Agent output"}</div>{output && <button className="ghost" onClick={() => navigator.clipboard.writeText(output.content)}>Copy</button>}</div>{notice && <p className="notice">{notice}</p>}{loading ? <div className="loading"><LoaderCircle className="spin" /> Thinking through your brief…</div> : output ? <pre>{output.content}</pre> : <div className="empty"><Sparkles size={24} /><p>Select an agent to generate a focused BRD contribution.</p></div>}</article>
        </section>
      </div>
    </section>
  </main>;
}

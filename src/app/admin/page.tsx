"use client";

import React, { useState, useEffect } from "react";
import CRTContainer from "@/components/CRTContainer";
import { soundHelper } from "@/lib/sounds";
import { Lock, Unlock, FolderGit, Cpu, FileJson, Mail, Edit, Trash2, Plus, Check } from "lucide-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"projects" | "resume" | "messages">("projects");

  // Database CRUD States
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  // Project Editor Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [techStack, setTechStack] = useState("");
  const [category, setCategory] = useState("Web");
  const [difficulty, setDifficulty] = useState(3);
  const [status, setStatus] = useState("DRAFT");

  // Resume Ingestion Form State
  const [resumeJson, setResumeJson] = useState("");
  const [ingestStatus, setIngestStatus] = useState("");

  const playClick = () => soundHelper?.playClick();
  const playSuccess = () => soundHelper?.playSuccess();

  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminData();
    }
  }, [isLoggedIn]);

  const fetchAdminData = async () => {
    try {
      const resProj = await fetch("/api/projects");
      const dataProj = await resProj.json();
      setProjects(dataProj.projects || []);

      const resMsg = await fetch("/api/contact");
      const dataMsg = await resMsg.json();
      setMessages(dataMsg.messages || []);
    } catch (_) {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    // Verify seeded credentials
    if (email === "mohitkishore145@gmail.com" && password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
      playSuccess();
    } else {
      setLoginError("ACCESS_DENIED: INVALID_CREDENTIALS");
      soundHelper?.playError();
    }
  };

  // CRUD actions for Projects
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    const payload = { title, slug, description, problem, solution, techStack, category, difficulty, status };

    try {
      const url = editingId ? `/api/projects` : `/api/projects`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (res.ok) {
        playSuccess();
        setIsEditing(false);
        setEditingId(null);
        clearProjectForm();
        fetchAdminData();
      }
    } catch (_) {}
  };

  const startEditProject = (proj: any) => {
    playClick();
    setIsEditing(true);
    setEditingId(proj.id);
    setTitle(proj.title);
    setSlug(proj.slug);
    setDescription(proj.description);
    setProblem(proj.problem || "");
    setSolution(proj.solution || "");
    setTechStack(proj.techStack);
    setCategory(proj.category || "Web");
    setDifficulty(proj.difficulty);
    setStatus(proj.status);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("CONFIRM_DELETE_PROJECT?")) return;
    playClick();

    try {
      const res = await fetch(`/api/projects`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        playSuccess();
        fetchAdminData();
      }
    } catch (_) {}
  };

  const clearProjectForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setProblem("");
    setSolution("");
    setTechStack("");
    setCategory("Web");
    setDifficulty(3);
    setStatus("DRAFT");
  };

  // Resume Sync Ingest action
  const handleIngestResume = async () => {
    playClick();
    setIngestStatus("PARSING...");

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: resumeJson,
      });

      if (res.ok) {
        setIngestStatus("SYNC_COMPLETE: RE-POPULATED DATABASE TABLES");
        playSuccess();
        setResumeJson("");
        fetchAdminData();
      } else {
        setIngestStatus("ERROR: SCHEMA_PARSING_FAILED");
        soundHelper?.playError();
      }
    } catch (_) {
      setIngestStatus("ERROR: REQUEST_FAILED");
      soundHelper?.playError();
    }
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <CRTContainer>
        <div className="max-w-md mx-auto my-12 bg-surface border-4 border-outline-variant p-6 dither-shadow font-mono">
          <div className="flex justify-between items-center border-b-2 border-outline-variant pb-2 mb-6 select-none">
            <h2 className="font-headline text-md text-primary font-bold flex items-center gap-2">
              <Lock className="w-4 h-4" /> SECURE_ADMIN_LOGIN
            </h2>
            <div className="w-3 h-3 bg-red-500"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant font-bold block select-none">
                ADMIN_EMAIL:
              </label>
              <div className="flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1">
                <span className="font-mono text-primary font-bold mr-2 select-none">&gt;</span>
                <input
                  type="email"
                  required
                  placeholder="mohitkishore145@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); soundHelper?.playKey(); }}
                  className="w-full bg-transparent border-none outline-none text-primary font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant font-bold block select-none">
                ADMIN_PASSWORD:
              </label>
              <div className="flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1">
                <span className="font-mono text-primary font-bold mr-2 select-none">&gt;</span>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); soundHelper?.playKey(); }}
                  className="w-full bg-transparent border-none outline-none text-primary font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 font-bold text-xs select-none text-center">
                {loginError}
              </p>
            )}

            <button type="submit" className="chunky-button-primary w-full py-2 flex items-center justify-center gap-2 select-none">
              <span>UNSEAL_SHELL</span>
            </button>
          </form>
        </div>
      </CRTContainer>
    );
  }

  // Dashboard View
  return (
    <CRTContainer>
      <div className="mb-4 font-mono text-xs text-on-surface-variant opacity-70">
        [SYS] SHELL_UNSEALED: Mohit Kishore Admin Dashboard Console ... OK
      </div>

      {/* Main Admin Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Admin Nav */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow select-none">
            <h3 className="font-headline text-sm text-primary mb-4 uppercase crt-glow flex items-center gap-2">
              <Unlock className="w-4 h-4 text-primary" /> ADMIN_SECTORS
            </h3>
            <div className="flex flex-col gap-2 font-label text-xs">
              <button
                onClick={() => { setActiveTab("projects"); playClick(); }}
                className={`w-full text-left p-3 border-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === "projects" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <FolderGit className="w-4 h-4" />
                <span>MANAGE_QUESTS</span>
              </button>
              <button
                onClick={() => { setActiveTab("resume"); playClick(); }}
                className={`w-full text-left p-3 border-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === "resume" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>INGEST_RESUME_JSON</span>
              </button>
              <button
                onClick={() => { setActiveTab("messages"); playClick(); }}
                className={`w-full text-left p-3 border-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === "messages" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>INCOMING_LOG_MESSAGES</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-9 bg-surface border-4 border-outline-variant p-6 dither-shadow">
          {/* Projects tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b-2 border-outline-variant pb-2">
                <h2 className="font-headline text-lg text-primary font-bold">MANAGE_QUEST_LOGS</h2>
                <button
                  onClick={() => { setIsEditing(true); setEditingId(null); clearProjectForm(); playClick(); }}
                  className="chunky-button-primary py-1 px-3 text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 fill-on-primary" /> NEW_QUEST
                </button>
              </div>

              {/* Editor modal / drawer */}
              {isEditing && (
                <form onSubmit={handleSaveProject} className="border-2 border-primary p-4 bg-surface-container-low space-y-4 font-mono text-xs">
                  <h3 className="font-headline text-xs text-primary font-bold uppercase mb-2">
                    {editingId ? "EDIT_DATA_BLOCK" : "NEW_DATA_BLOCK"}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">TITLE:</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">SLUG:</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => { setSlug(e.target.value); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">CATEGORY:</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">DIFFICULTY (1-5):</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={difficulty}
                        onChange={(e) => { setDifficulty(Number(e.target.value)); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">STATUS:</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-on-surface-variant">TECH_STACK (COMMA-SEPARATED):</label>
                    <input
                      type="text"
                      required
                      placeholder="React,TypeScript,Prisma"
                      value={techStack}
                      onChange={(e) => { setTechStack(e.target.value); soundHelper?.playKey(); }}
                      className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-on-surface-variant">DESCRIPTION:</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); soundHelper?.playKey(); }}
                      className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">PROBLEM_STATEMENT:</label>
                      <textarea
                        rows={3}
                        value={problem}
                        onChange={(e) => { setProblem(e.target.value); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-on-surface-variant">SOLUTION:</label>
                      <textarea
                        rows={3}
                        value={solution}
                        onChange={(e) => { setSolution(e.target.value); soundHelper?.playKey(); }}
                        className="w-full bg-surface-container border border-outline-variant text-primary p-1.5 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" className="chunky-button-primary py-2 px-6">
                      SAVE_CHANGES
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setEditingId(null); playClick(); }}
                      className="chunky-button py-2 px-6"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List */}
              <div className="space-y-3 font-mono text-xs">
                {projects.map((proj) => (
                  <div key={proj.id} className="flex justify-between items-center border border-outline-variant/30 p-3 hover:bg-surface-container select-none">
                    <div>
                      <h4 className="text-primary font-bold">{proj.title} ({proj.slug})</h4>
                      <p className="text-[10px] text-on-surface-variant">{proj.category} | STATUS: {proj.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditProject(proj)}
                        className="p-1 border border-outline-variant hover:border-primary hover:text-primary cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1 border border-outline-variant hover:border-red-500 hover:text-red-500 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume JSON tab */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <div className="border-b-2 border-outline-variant pb-2 select-none">
                <h2 className="font-headline text-lg text-primary font-bold">INGEST_RESUME_DATA</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Synchronize the portfolio directly with a standardized JSON resume.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <label className="text-on-surface-variant font-bold block select-none">RESUME_JSON_INPUT:</label>
                <textarea
                  rows={8}
                  placeholder='Paste JSON resume schema here, e.g. { "skills": [...], "experience": [...] }'
                  value={resumeJson}
                  onChange={(e) => { setResumeJson(e.target.value); soundHelper?.playKey(); }}
                  className="w-full bg-surface-container border-2 border-outline-variant text-primary p-2 focus:outline-none resize-none font-mono text-xs"
                />

                <button
                  onClick={handleIngestResume}
                  disabled={!resumeJson}
                  className="chunky-button-primary w-full py-2.5 flex items-center justify-center gap-2 select-none"
                >
                  <FileJson className="w-4 h-4 fill-on-primary" />
                  <span>SYNC_RESUME_DATABASES</span>
                </button>

                {ingestStatus && (
                  <p className="text-center font-bold text-xs text-secondary border border-outline-variant/30 p-2 bg-surface/50 select-none">
                    {ingestStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Incoming Messages tab */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="border-b-2 border-outline-variant pb-2 select-none">
                <h2 className="font-headline text-lg text-primary font-bold">INCOMING_LOG_MESSAGES</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Read communications submitted from the save-point contact terminals.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-outline-variant/30 p-4 bg-surface-container-low select-none">
                    <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2 mb-2">
                      <span className="text-primary font-bold">{msg.name} ({msg.email})</span>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-[9px] text-on-surface-variant opacity-60 mt-2">IP_ADDR: {msg.ipAddress || "Unknown"}</p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <p className="text-on-surface-variant opacity-50 select-none text-center py-8">
                    NO_INCOMING_MESSAGES_SAVED
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CRTContainer>
  );
}

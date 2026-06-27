"use client";

import React, { useState } from "react";
import CRTContainer from "@/components/CRTContainer";
import { soundHelper } from "@/lib/sounds";
import { Mail, GitBranch, Link2, FileText, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "transmitting" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const playClick = () => {
    if (soundHelper) soundHelper.playClick();
  };

  const playSuccess = () => {
    if (soundHelper) soundHelper.playSuccess();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: (val: string) => void) => {
    setter(e.target.value);
    if (soundHelper) soundHelper.playKey();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    playClick();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("transmitting");
        let currentProg = 0;
        const interval = setInterval(() => {
          currentProg += 10;
          setProgress(currentProg);
          if (soundHelper) soundHelper.playKey();

          if (currentProg >= 100) {
            clearInterval(interval);
            setStatus("success");
            if (soundHelper) soundHelper.playSuccess();
            setName("");
            setEmail("");
            setMessage("");
          }
        }, 150);
      } else {
        setStatus("error");
        if (soundHelper) soundHelper.playError();
      }
    } catch (_) {
      setStatus("error");
      if (soundHelper) soundHelper.playError();
    }
  };

  return (
    <CRTContainer>
      <div className="mb-4 font-mono text-xs text-on-surface-variant opacity-70">
        [SYS] LINK_ESTABLISHED: /USER/CHANNELS/COM_TERM.EXE ... OK
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Status & Ambient */}
        <div className="lg:col-span-5 space-y-6">
          <div className="pixel-border p-6 bg-surface dither-shadow">
            <div className="flex justify-between items-center border-b-2 border-outline-variant mb-4 pb-2 select-none">
              <span className="font-headline text-md text-primary font-bold">SYSTEM_STATUS</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-primary"></div>
                <div className="w-2.5 h-2.5 bg-outline-variant"></div>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs text-on-surface-variant select-none">
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary inline-block"></span>
                <span>SIGNAL: ENCRYPTED_SSL</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary inline-block"></span>
                <span>DB_CONNECTION: OPTIMAL</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary inline-block"></span>
                <span>GEO_SLOT: [REDACTED]</span>
              </p>

              {status === "transmitting" && (
                <div className="pt-4 space-y-2">
                  <span className="block font-label text-[10px] text-primary font-bold uppercase">
                    TRANSMITTING DATA_STREAM BUFFER: {progress}%
                  </span>
                  <div className="w-full bg-surface-container-high h-6 flex items-center p-0.5 border border-outline-variant">
                    <div
                      className="bg-primary h-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="pt-4 border-t border-outline-variant/30 text-secondary space-y-2">
                  <p className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>TRANSMISSION_SUCCESSFUL</span>
                  </p>
                  <p className="text-[10px]">
                    Message saved in PostgreSQL block. Resend protocol completed. Mohit will reply soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Social vectors */}
          <div className="pixel-border p-6 bg-surface dither-shadow space-y-4 select-none">
            <h3 className="font-headline text-sm text-primary font-bold border-b-2 border-outline-variant pb-2 uppercase">
              SOCIAL_NETWORKS
            </h3>
            <div className="grid grid-cols-2 gap-4 font-label text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onClick={playClick}
                className="p-3 border border-outline-variant hover:border-primary hover:text-primary flex items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer"
              >
                <GitBranch className="w-4 h-4" />
                <span>GITHUB</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                onClick={playClick}
                className="p-3 border border-outline-variant hover:border-primary hover:text-primary flex items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
                <span>LINKEDIN</span>
              </a>
              <a
                href="mailto:contact@mohit.exe"
                onClick={playClick}
                className="p-3 border border-outline-variant hover:border-primary hover:text-primary flex items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>EMAIL</span>
              </a>
              <a
                href="/Mohit_Kishore_Resume.txt"
                download
                onClick={playSuccess}
                className="p-3 border border-outline-variant hover:border-yellow-500 hover:text-yellow-500 flex items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>DOWNLOAD_CV</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Communication form */}
        <div className="lg:col-span-7 bg-surface border-4 border-outline-variant p-6 dither-shadow">
          <div className="border-b-2 border-outline-variant pb-3 mb-6 select-none">
            <h2 className="font-headline text-xl text-primary font-bold">TRANSMISSION_TERMINAL</h2>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Send a secure message directly to Mohit&apos;s database nodes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant font-bold block select-none">
                SENDER_NAME:
              </label>
              <div className="flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1">
                <span className="font-mono text-primary font-bold mr-2 select-none">&gt;</span>
                <input
                  type="text"
                  required
                  placeholder="Enter name..."
                  value={name}
                  onChange={(e) => handleTextChange(e, setName)}
                  disabled={status === "submitting" || status === "transmitting"}
                  className="w-full bg-transparent border-none outline-none text-primary font-mono focus:ring-0 p-0 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant font-bold block select-none">
                SENDER_EMAIL:
              </label>
              <div className="flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1">
                <span className="font-mono text-primary font-bold mr-2 select-none">&gt;</span>
                <input
                  type="email"
                  required
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => handleTextChange(e, setEmail)}
                  disabled={status === "submitting" || status === "transmitting"}
                  className="w-full bg-transparent border-none outline-none text-primary font-mono focus:ring-0 p-0 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant font-bold block select-none">
                MESSAGE_PAYLOAD:
              </label>
              <div className="flex items-start border-2 border-outline-variant bg-surface-container-low px-2 py-1">
                <span className="font-mono text-primary font-bold mr-2 mt-1 select-none">&gt;</span>
                <textarea
                  required
                  rows={5}
                  placeholder="Write details here..."
                  value={message}
                  onChange={(e) => handleTextChange(e, setMessage)}
                  disabled={status === "submitting" || status === "transmitting"}
                  className="w-full bg-transparent border-none outline-none text-primary font-mono focus:ring-0 p-0 text-sm focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || status === "transmitting" || !name || !email || !message}
              className="chunky-button-primary w-full py-2.5 flex items-center justify-center gap-2 select-none"
            >
              <Send className="w-4 h-4 fill-on-primary" />
              <span>TRANSMIT_SIGNAL</span>
            </button>
          </form>
        </div>
      </div>
    </CRTContainer>
  );
}

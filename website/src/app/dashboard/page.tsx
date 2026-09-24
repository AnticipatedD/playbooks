// Copyright Advanced Micro Devices, Inc.
//
// SPDX-License-Identifier: MIT

"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  buildMatrix, 
  CellContent, 
  OS_LABELS, 
  HARDWARE_LABELS, 
  type RunnerInfo 
} from "@/components/dashboard/RunnerMatrix";

function SetupGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden max-w-2xl mx-auto">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#242424] transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[#a0a0a0]">
          <svg className="w-4 h-4 text-[#D4915D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to configure the GITHUB_TOKEN for this dashboard
        </span>
        <svg
          className={`w-4 h-4 text-[#6b6b6b] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-[#333] pt-4 text-sm text-[#a0a0a0] space-y-3 animate-fade-in">
          <p>
            This dashboard reads the registered self-hosted runners via the GitHub API using a{" "}
            <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">DASHBOARD_GITHUB_TOKEN</code>{" "}
            environment variable set on the server.
          </p>
          <h4 className="text-white font-semibold pt-1">Setting the token</h4>
          <p>
            Create a{" "}
            <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">.env.local</code>{" "}
            file in the <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">website/</code> directory:
          </p>
          <pre className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-xs font-mono text-[#e0e0e0] overflow-x-auto">
            DASHBOARD_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
          </pre>
          <h4 className="text-white font-semibold pt-1">Creating the token</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to{" "}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4915D] hover:underline"
              >
                GitHub Settings &rarr; Fine-grained tokens
              </a>
            </li>
            <li>Click <strong className="text-white">Generate new token</strong></li>
            <li>
              Set <strong className="text-white">Repository access</strong> to{" "}
              <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">Only select repositories</code>{" "}
              and pick <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">amd/playbooks</code>
            </li>
            <li>
              Under <strong className="text-white">Repository permissions</strong>, set{" "}
              <code className="bg-[#242424] px-1.5 py-0.5 rounded text-[#D4915D] text-xs">Administration</code>{" "}
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [runners, setRunners] = useState<RunnerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRunners() {
      try {
        const res = await fetch("/api/dashboard/runners");
        if (res.ok) {
          const data = await res.json();
          setRunners(data);
        }
      } catch (err) {
        console.error("Failed to pull dashboard runner metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRunners();
  }, []);

  const matrix = buildMatrix(runners);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hardware Runner Matrix</h1>
          <p className="text-sm text-[#a0a0a0] mt-1">Status and allocation overview of self-hosted build nodes.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-[#6b6b6b]">Loading matrix metrics...</div>
        ) : (
          <div className="border border-[#2a2a2a] rounded-xl overflow-hidden bg-[#111]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2a] bg-[#161616]">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] w-64">Hardware Platform</th>
                    {OS_LABELS.map((os) => (
                      <th key={os} className="p-4 text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{os}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {Object.values(HARDWARE_LABELS).map((hw) => (
                    <tr key={hw} className="hover:bg-[#141414] transition-colors">
                      <td className="p-4 font-semibold text-sm text-white bg-[#131313]/50 border-r border-[#2a2a2a]">{hw}</td>
                      {OS_LABELS.map((os) => (
                        <td key={os} className="p-4 valign-top align-top">
                          <CellContent cell={matrix[hw][os]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <SetupGuide />
      </main>
      <Footer />
    </div>
  );
}

// Copyright Advanced Micro Devices, Inc.
//
// SPDX-License-Identifier: MIT

"use client";

import React from "react";

export interface RunnerInfo {
  runner_id: number;
  runner_name: string;
  os: string;
  status: string;
  busy: boolean;
  labels: string[];
}

export interface CellData {
  runners: RunnerInfo[];
}

export type MatrixData = Record<string, Record<string, CellData>>;

export const HARDWARE_LABELS: Record<string, string> = {
  halo: "Ryzen™ AI Max",
  grgh: "Gorgon Halo",
  mdsh: "Medusa Halo",
  stx: "Ryzen™ AI 300 HX",
  krk: "Ryzen™ AI 300",
  grgp: "Gorgon Point",
  mdsp: "Medusa Point",
  rx7900xt: "Radeon™ RX 7900 XT",
  rx9070xt: "Radeon™ RX 9070 XT",
  r9700: "Radeon™ AI PRO R9700",
};

export const OS_LABELS = ["Windows", "Linux"];

export function classifyRunner(runner: RunnerInfo): { hardware: string; os: string } {
  const searchable = [
    runner.runner_name.toLowerCase(),
    ...runner.labels.map((l) => l.toLowerCase()),
  ].join(" ");

  let hardware = "Other";
  for (const [key, display] of Object.entries(HARDWARE_LABELS)) {
    if (searchable.includes(key.toLowerCase())) {
      hardware = display;
      break;
    }
  }

  let os = "Other";
  const runnerOs = runner.os.toLowerCase();
  for (const osName of OS_LABELS) {
    if (runnerOs.includes(osName.toLowerCase())) {
      os = osName;
      break;
    }
  }

  return { hardware, os };
}

export function buildMatrix(runners: RunnerInfo[]): MatrixData {
  const matrix: MatrixData = {};
  for (const hw of Object.values(HARDWARE_LABELS)) {
    matrix[hw] = {};
    for (const os of OS_LABELS) {
      matrix[hw][os] = { runners: [] };
    }
  }

  for (const runner of runners) {
    const { hardware, os } = classifyRunner(runner);
    if (matrix[hardware]?.[os]) {
      matrix[hardware][os].runners.push(runner);
    }
  }

  return matrix;
}

export function RunnerStatus({ runner }: { runner: RunnerInfo }) {
  if (runner.status !== "online") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6b6b6b]" />
        <span className="text-[#6b6b6b] text-xs font-medium">Offline</span>
      </div>
    );
  }

  if (runner.busy) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
        </span>
        <span className="text-yellow-400 text-xs font-medium">Busy</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
      <span className="text-green-400 text-xs font-medium">Idle</span>
    </div>
  );
}

const REQUIRED_RUNNERS = 2;

function cellOnlineCount(cell: CellData): number {
  return cell.runners.filter((r) => r.status === "online").length;
}

export function CellContent({ cell }: { cell: CellData }) {
  const online = cellOnlineCount(cell);
  const sufficient = online >= REQUIRED_RUNNERS;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold tabular-nums ${sufficient ? "text-green-400" : "text-[#a0a0a0]"}`}>
          {online}/{REQUIRED_RUNNERS}
        </span>
        {!sufficient && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-yellow-500/80">
            needs {REQUIRED_RUNNERS - online} more
          </span>
        )}
      </div>

      {cell.runners.map((runner) => (
        <div
          key={runner.runner_id}
          className="px-3.5 py-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] transition-colors"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium text-white truncate">{runner.runner_name}</span>
            <RunnerStatus runner={runner} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {runner.labels
              .filter((l) => l !== "self-hosted")
              .map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-[#242424] border border-[#333] text-[#a0a0a0]"
                >
                  {label}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

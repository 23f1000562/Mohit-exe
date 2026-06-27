"use client";

import React, { useState, useEffect } from "react";
import CRTContainer from "@/components/CRTContainer";
import { soundHelper } from "@/lib/sounds";
import { Brain, Cpu, Database, Eye, Terminal as TermIcon, Sliders, Play, RotateCcw } from "lucide-react";

type LabCategory = "ML" | "DL" | "CV" | "NLP" | "LLM" | "MLOPS";

export default function AiLabPage() {
  const [activeCategory, setActiveCategory] = useState<LabCategory>("DL");
  const [isPlaying, setIsPlaying] = useState(false);

  // DL state
  const [learningRate, setLearningRate] = useState("0.01");
  const [epochs, setEpochs] = useState(10);
  const [optimizer, setOptimizer] = useState("ADAM");
  const [dlLogs, setDlLogs] = useState<string[]>([]);
  const [dlLoss, setDlLoss] = useState<number[]>([]);

  // CV state
  const [cvMatrix, setCvMatrix] = useState([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
  ]);
  const [cvOutput, setCvOutput] = useState<number[][]>([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ]);

  // LLM state
  const [llmPrompt, setLlmPrompt] = useState("What is an agent?");
  const [llmTokens, setLlmTokens] = useState<{ token: string; prob: number }[]>([]);

  // MLOps state
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 58, throughput: 120, latency: 12 });

  useEffect(() => {
    // Ambient MLOps updates
    if (activeCategory === "MLOPS") {
      const interval = setInterval(() => {
        setMetrics({
          cpu: Math.min(100, Math.max(10, 42 + Math.floor(Math.random() * 20 - 10))),
          ram: Math.min(100, Math.max(10, 58 + Math.floor(Math.random() * 6 - 3))),
          throughput: 120 + Math.floor(Math.random() * 40 - 20),
          latency: Math.max(2, 12 + Math.floor(Math.random() * 6 - 3)),
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [activeCategory]);

  const playClick = () => {
    if (soundHelper) soundHelper.playClick();
  };

  const playSuccess = () => {
    if (soundHelper) soundHelper.playSuccess();
  };

  // Run DL Training simulation
  const runDlTraining = async () => {
    playSuccess();
    setIsPlaying(true);
    setDlLogs(["[SYS] CORE_INITIALIZED: GPU_ALLOC_OK", `[SYS] LR: ${learningRate} // OPTIMIZER: ${optimizer}`]);
    setDlLoss([]);

    let loss = 0.95;
    for (let e = 1; e <= epochs; e++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Learning decrease
      const decay = optimizer === "ADAM" ? 0.75 : 0.85;
      loss = loss * (decay + Math.random() * 0.1);
      const blocks = Math.round(loss * 20);
      const bar = `[${"|".repeat(blocks)}${".".repeat(Math.max(0, 20 - blocks))}]`;
      
      setDlLoss((prev) => [...prev, loss]);
      setDlLogs((prev) => [
        ...prev,
        `EPOCH ${e}/${epochs} -- Loss: ${loss.toFixed(4)} ${bar} Acc: ${(100 - loss * 80).toFixed(2)}%`
      ]);
      if (soundHelper) soundHelper.playKey();
    }
    setDlLogs((prev) => [...prev, "[SYS] PROCESS_COMPLETE: LOSS_CONVERGED. MODEL_SAVED."]);
    setIsPlaying(false);
  };

  // Run CV Kernel convolution
  const runCvConvolve = () => {
    playSuccess();
    const result = Array(5).fill(0).map(() => Array(5).fill(0));
    // Simulated convolution effect on simple grid
    for (let r = 1; r < 4; r++) {
      for (let c = 1; c < 4; c++) {
        // sum kernel coefficients
        let sum = 0;
        for (let kr = -1; kr <= 1; kr++) {
          for (let kc = -1; kc <= 1; kc++) {
            sum += cvMatrix[kr + 1][kc + 1] * 2;
          }
        }
        result[r][c] = Math.max(0, Math.min(9, Math.abs(sum)));
      }
    }
    setCvOutput(result);
  };

  // Run LLM generation simulation
  const runLlmGen = async () => {
    playSuccess();
    setIsPlaying(true);
    setLlmTokens([]);

    const responses = [
      { token: "AN", prob: 98.4 },
      { token: "AGENT", prob: 99.2 },
      { token: "IS", prob: 95.1 },
      { token: "A", prob: 88.6 },
      { token: "SOFTWARE", prob: 91.2 },
      { token: "ENTITY", prob: 75.8 },
      { token: "OPERATING", prob: 84.5 },
      { token: "AUTONOMOUSLY", prob: 96.3 },
      { token: "VIA", prob: 89.0 },
      { token: "A", prob: 94.2 },
      { token: "FEEDBACK", prob: 97.4 },
      { token: "LOOP.", prob: 99.1 }
    ];

    for (const item of responses) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLlmTokens((prev) => [...prev, item]);
      if (soundHelper) soundHelper.playKey();
    }
    setIsPlaying(false);
  };

  const categories = [
    { id: "DL", name: "DEEP_LEARNING", desc: "Neural networks weights training emulators.", icon: <Brain className="w-5 h-5" /> },
    { id: "CV", name: "COMPUTER_VISION", desc: "Interactive convolution filter kernels.", icon: <Eye className="w-5 h-5" /> },
    { id: "LLM", name: "LLM_GENERATION", desc: "Token streaming probability log visualizer.", icon: <TermIcon className="w-5 h-5" /> },
    { id: "MLOPS", name: "MLOPS_MONITOR", desc: "Real-time pipeline server dashboard metrics.", icon: <Cpu className="w-5 h-5" /> },
    { id: "ML", name: "REGRESSION_LAB", desc: "Statistical datasets optimization tools.", icon: <Database className="w-5 h-5" /> }
  ];

  return (
    <CRTContainer>
      <div className="mb-4 font-mono text-xs text-on-surface-variant opacity-70">
        [SYS] ACCESSING_NEURAL_SECTOR: /AI_EXPERIENCE_LAB ... OK
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Category selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow select-none">
            <h3 className="font-headline text-lg text-primary mb-4 uppercase crt-glow">AI_LAB_SECTORS</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as LabCategory);
                    setDlLogs([]);
                    setDlLoss([]);
                    setLlmTokens([]);
                    playClick();
                  }}
                  className={`w-full text-left p-3 border-2 font-label text-xs flex items-center gap-3 active:translate-y-[2px] transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {cat.icon}
                  <div>
                    <p className="font-bold">{cat.name}</p>
                    <p className="text-[10px] opacity-75">{cat.id}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive emulator details */}
        <div className="lg:col-span-8 bg-surface border-4 border-outline-variant p-6 dither-shadow">
          {/* Deep Learning Sector */}
          {activeCategory === "DL" && (
            <div className="space-y-6">
              <div className="border-b-2 border-outline-variant pb-3 select-none">
                <h2 className="font-headline text-xl text-primary font-bold">DEEP_LEARNING_LOGS</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Optimize deep networks. Tune hyper-parameters and run dynamic weights training.
                </p>
              </div>

              {/* Hyperparameter sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-label text-xs select-none">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-bold">LEARNING_RATE:</label>
                  <select
                    value={learningRate}
                    onChange={(e) => setLearningRate(e.target.value)}
                    className="w-full bg-surface-container border-2 border-outline-variant text-primary p-2 focus:outline-none focus:border-primary"
                  >
                    <option value="0.1">0.1 (HIGH)</option>
                    <option value="0.01">0.01 (DEFAULT)</option>
                    <option value="0.001">0.001 (FINE_TUNE)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-on-surface-variant font-bold">TRAINING_EPOCHS:</label>
                  <select
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    className="w-full bg-surface-container border-2 border-outline-variant text-primary p-2 focus:outline-none focus:border-primary"
                  >
                    <option value="5">5 EPOCHS</option>
                    <option value="10">10 EPOCHS</option>
                    <option value="15">15 EPOCHS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-on-surface-variant font-bold">OPTIMIZATION_METHOD:</label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    className="w-full bg-surface-container border-2 border-outline-variant text-primary p-2 focus:outline-none focus:border-primary"
                  >
                    <option value="ADAM">ADAM (RECOMMENDED)</option>
                    <option value="SGD">STOCHASTIC_GRADIENT</option>
                  </select>
                </div>
              </div>

              {/* Action trigger */}
              <button
                disabled={isPlaying}
                onClick={runDlTraining}
                className="chunky-button-primary w-full py-2 flex items-center justify-center gap-2 select-none"
              >
                <Play className="w-4 h-4 fill-on-primary" />
                <span>COMPILE_AND_EXECUTE_TRAINING</span>
              </button>

              {/* Log output viewport */}
              <div className="bg-surface-container-lowest p-4 border-2 border-outline-variant font-mono text-xs text-primary min-h-[160px] max-h-[220px] overflow-y-auto space-y-1">
                {dlLogs.map((log, idx) => (
                  <p key={idx} className={log.startsWith("[SYS]") ? "text-secondary font-bold" : ""}>
                    {log}
                  </p>
                ))}
                {dlLogs.length === 0 && (
                  <p className="text-on-surface-variant opacity-50 select-none">
                    &gt; Console idle. Click trigger above to run weights optimizer...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Computer Vision Sector */}
          {activeCategory === "CV" && (
            <div className="space-y-6">
              <div className="border-b-2 border-outline-variant pb-3 select-none">
                <h2 className="font-headline text-xl text-primary font-bold font-bold">IMAGE_CONVOLUTION_MATRIX</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Apply a 3x3 kernel matrix convolution over a representation grid.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 select-none">
                {/* Left side: Kernel builder */}
                <div className="space-y-2">
                  <span className="font-label text-xs text-on-surface-variant font-bold block mb-2">3x3 CONVOLUTION KERNEL:</span>
                  <div className="grid grid-cols-3 gap-2 max-w-[180px]">
                    {cvMatrix.map((row, r) =>
                      row.map((val, c) => (
                        <input
                          key={`${r}-${c}`}
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const newMat = [...cvMatrix];
                            newMat[r][c] = Number(e.target.value);
                            setCvMatrix(newMat);
                          }}
                          className="bg-surface-container-low border-2 border-outline-variant text-primary text-center font-mono focus:outline-none focus:border-primary text-sm p-1.5"
                        />
                      ))
                    )}
                  </div>
                  <button
                    onClick={runCvConvolve}
                    className="chunky-button-primary py-2 px-4 text-xs w-full max-w-[180px] mt-4"
                  >
                    CONVOLVE
                  </button>
                </div>

                {/* Right side: Matrix Output viewer */}
                <div>
                  <span className="font-label text-xs text-on-surface-variant font-bold block mb-2">FILTERED MATRIX PREVIEW:</span>
                  <div className="grid grid-cols-5 gap-1.5 max-w-[160px]">
                    {cvOutput.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`${r}-${c}`}
                          style={{ opacity: val > 0 ? 0.3 + val * 0.07 : 0.1 }}
                          className={`w-6 h-6 border flex items-center justify-center font-mono text-[9px] font-bold ${
                            val > 0 ? "bg-primary border-primary text-on-primary" : "border-outline-variant text-on-surface-variant"
                          }`}
                        >
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LLM Sector */}
          {activeCategory === "LLM" && (
            <div className="space-y-6">
              <div className="border-b-2 border-outline-variant pb-3 select-none">
                <h2 className="font-headline text-xl text-primary font-bold">TOKEN_PROBABILITY_STREAM</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Inspect the internal token probabilities computed by Mohit&apos;s AI agent prompt resolver.
                </p>
              </div>

              {/* Input builder */}
              <div className="space-y-2 select-none">
                <label className="font-label text-xs text-on-surface-variant font-bold">AGENT_INSTRUCTION_PROMPT:</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={llmPrompt}
                    onChange={(e) => setLlmPrompt(e.target.value)}
                    className="flex-grow bg-surface-container border-2 border-outline-variant text-primary font-mono text-xs focus:outline-none p-2 focus:border-primary"
                  />
                  <button
                    disabled={isPlaying}
                    onClick={runLlmGen}
                    className="chunky-button-primary py-2 px-6"
                  >
                    GENERATE
                  </button>
                </div>
              </div>

              {/* Output log */}
              <div className="bg-surface-container-lowest p-4 border-2 border-outline-variant font-mono text-xs min-h-[140px] max-h-[220px] overflow-y-auto space-y-1">
                {llmTokens.map((item, idx) => (
                  <p key={idx} className="flex justify-between border-b border-outline-variant/10 pb-1">
                    <span className="text-primary font-bold">&gt; token_{idx}: &quot;{item.token}&quot;</span>
                    <span className="text-secondary">prob: {item.prob.toFixed(1)}%</span>
                  </p>
                ))}
                {llmTokens.length === 0 && (
                  <p className="text-on-surface-variant opacity-50 select-none">
                    &gt; LLM console idle. Click generate to inspect parameters...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* MLOps Sector */}
          {activeCategory === "MLOPS" && (
            <div className="space-y-6 select-none">
              <div className="border-b-2 border-outline-variant pb-3">
                <h2 className="font-headline text-xl text-primary font-bold">MLOPS_PIPELINE_DASHBOARD</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Monitoring live models deployment container statistics, latency, and CPU load profiles.
                </p>
              </div>

              {/* Bento dashboard stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border-2 border-outline-variant p-3 text-center">
                  <span className="font-label text-[10px] text-on-surface-variant block mb-1">CPU_LOAD:</span>
                  <span className="font-headline text-lg text-primary font-bold">{metrics.cpu}%</span>
                </div>
                <div className="border-2 border-outline-variant p-3 text-center">
                  <span className="font-label text-[10px] text-on-surface-variant block mb-1">RAM_USAGE:</span>
                  <span className="font-headline text-lg text-primary font-bold">{metrics.ram}%</span>
                </div>
                <div className="border-2 border-outline-variant p-3 text-center">
                  <span className="font-label text-[10px] text-on-surface-variant block mb-1">THROUGHPUT:</span>
                  <span className="font-headline text-lg text-secondary font-bold">{metrics.throughput} req/s</span>
                </div>
                <div className="border-2 border-outline-variant p-3 text-center">
                  <span className="font-label text-[10px] text-on-surface-variant block mb-1">API_LATENCY:</span>
                  <span className="font-headline text-lg text-amber-500 font-bold">{metrics.latency}ms</span>
                </div>
              </div>
            </div>
          )}

          {/* ML Sector */}
          {activeCategory === "ML" && (
            <div className="space-y-6 select-none">
              <div className="border-b-2 border-outline-variant pb-3">
                <h2 className="font-headline text-xl text-primary font-bold">REGRESSION_GRADIENT_DESCENT</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Inspect optimization of weights (W) and bias (B) variables under linear statistics models.
                </p>
              </div>

              <div className="border-2 border-outline-variant p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-label">
                  <span className="text-on-surface-variant font-bold">TARGET_EQUATION: Y = 2X + 5</span>
                  <span className="text-primary font-bold">TRAINING_STATE: CONVERGED</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">&gt; Weights (W):</span>
                    <span className="text-primary font-bold">1.9982 (target: 2.0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">&gt; Bias (B):</span>
                    <span className="text-primary font-bold">5.0014 (target: 5.0)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">&gt; Mean Squared Error (MSE):</span>
                    <span className="text-secondary font-bold">0.0003</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CRTContainer>
  );
}

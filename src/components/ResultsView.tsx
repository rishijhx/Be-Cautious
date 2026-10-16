import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  User, 
  Lock, 
  CheckSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Info
} from 'lucide-react';
import { AssessmentRecord, CategoryKey } from '../types';
import { exportRecordAsJson, exportRecordAsCsv } from '../lib/storage';

interface ResultsViewProps {
  record: AssessmentRecord;
  onNavigateToActionPlan: () => void;
  onNavigateToSimulator: () => void;
  onNewScan: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  record,
  onNavigateToActionPlan,
  onNavigateToSimulator,
  onNewScan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('identity');
  const [expandedFactorId, setExpandedFactorId] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-emerald-400 border-emerald-500/40';
    if (score < 50) return 'text-blue-400 border-blue-500/40';
    if (score < 75) return 'text-amber-400 border-amber-500/40';
    return 'text-red-400 border-red-500/40';
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low':
        return <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Low Exposure (0–24)</span>;
      case 'Moderate':
        return <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">Moderate Exposure (25–49)</span>;
      case 'High':
        return <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">High Exposure (50–74)</span>;
      default:
        return <span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">Critical Exposure (75–100)</span>;
    }
  };

  const categoryList = Object.values(record.categoryScores);
  const activeCategoryDetail = record.categoryScores[selectedCategory];
  const factorsForActiveCategory = record.scoredFactors.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>EXPOSURE ASSESSMENT REPORT</span>
            <span>·</span>
            <span>ID: {record.id.slice(0, 12)}</span>
            {record.isSample && (
              <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 text-cyan-300">
                SIMULATED SAMPLE
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {record.profileName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Completed {new Date(record.timestamp).toLocaleString()} · Evaluated with deterministic risk engine & AI analysis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportRecordAsJson(record)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => exportRecordAsCsv(record)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Primary Risk Gauge & Summary Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Score Card */}
        <div className="lg:col-span-5 rounded-xl bg-[#0c1220] border border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Privacy Risk Score
            </span>
            {getRiskBadge(record.riskLevel)}
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className={`relative flex items-center justify-center h-44 w-44 rounded-full border-4 ${getScoreColor(record.overallScore)} bg-slate-900/60 shadow-xl`}>
              <div className="text-center">
                <span className="text-5xl font-black font-mono text-white tabular-nums tracking-tighter">
                  {record.overallScore}
                </span>
                <span className="text-xs text-slate-400 block font-mono">/ 100</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-center text-slate-400 max-w-xs leading-relaxed">
              Normalized score based on weighted factors across 6 privacy categories. Higher scores indicate greater exposure to social engineering.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Flags Detected</span>
              <span className="font-mono font-bold text-white text-base tabular-nums">
                {record.totalIndicators}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 text-[11px] block">High Priority</span>
              <span className="font-mono font-bold text-red-400 text-base tabular-nums">
                {record.highPriorityRisks.length}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 text-[11px] block">Action Items</span>
              <span className="font-mono font-bold text-cyan-400 text-base tabular-nums">
                {record.actionPlan.length}
              </span>
            </div>
          </div>
        </div>

        {/* AI & Intelligence Summary Card */}
        <div className="lg:col-span-7 rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Privacy Intelligence Summary
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Engine: {record.aiAnalysis.engineUsed}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {record.aiAnalysis.summary}
            </p>
          </div>

          {/* Quick Attack Vector Preview */}
          {record.aiAnalysis.socialEngineeringRisks.length > 0 && (
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-cyan-300 block">
                Primary Exploitation Vector: {record.aiAnalysis.socialEngineeringRisks[0].attackType}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {record.aiAnalysis.socialEngineeringRisks[0].explanation}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onNavigateToActionPlan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 transition-all cursor-pointer"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Review Personalized Action Plan ({record.actionPlan.length} steps)</span>
            </button>

            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 text-xs font-semibold text-violet-300 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Test in Social Engineering Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXPOSURE VISUALIZER (Requirement #8) */}
      <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Exposure Visualizer</h2>
            <p className="text-xs text-slate-400">
              Interactive category risk meters. Click any category to view contributing answers, risks, and remedies.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">6 VECTORS ASSESSED</span>
        </div>

        {/* Category Tabs / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryList.map((cat) => {
            const isSelected = selectedCategory === cat.category;
            let barColor = 'bg-emerald-500';
            if (cat.score >= 75) barColor = 'bg-red-500';
            else if (cat.score >= 50) barColor = 'bg-amber-500';
            else if (cat.score >= 25) barColor = 'bg-blue-500';

            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block line-clamp-1 mb-1">
                    {cat.label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      {cat.score}
                    </span>
                    <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="w-full space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full`}
                      style={{ width: `${Math.max(5, cat.score)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {cat.findingsCount} factor{cat.findingsCount === 1 ? '' : 's'} flagged
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Drill-Down Details */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{activeCategoryDetail.label}</span>
                {getRiskBadge(activeCategoryDetail.level)}
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeCategoryDetail.description}</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Weight: {Math.round(activeCategoryDetail.weight * 100)}% of total risk
            </span>
          </div>

          {/* Factors in this category */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Contributing Factors & Rules Triggered ({factorsForActiveCategory.length}):
            </span>

            {factorsForActiveCategory.length > 0 ? (
              factorsForActiveCategory.map((factor) => {
                const isExpanded = expandedFactorId === factor.id;
                return (
                  <div
                    key={factor.id}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2 text-xs"
                  >
                    <div
                      onClick={() => setExpandedFactorId(isExpanded ? null : factor.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {factor.status === 'danger' && <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
                        {factor.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />}
                        {factor.status === 'safe' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                        <span className="font-semibold text-slate-200">{factor.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400">
                          +{factor.riskPoints} pts
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800/60 space-y-2 text-[11px] leading-relaxed">
                        <div>
                          <strong className="text-slate-300">Why this matters: </strong>
                          <span className="text-slate-400">{factor.explanation}</span>
                        </div>
                        <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                          <strong className="text-cyan-300">Defensive Remedy: </strong>
                          <span>{factor.remedy}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-lg bg-slate-950/40 text-xs text-slate-400 text-center">
                No negative exposure factors triggered in this category. Excellent privacy discipline!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI EXPOSURE FINDINGS & SOCIAL ENGINEERING RISKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exposure Findings */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Identified Exposure Findings
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {record.aiAnalysis.exposureFindings.length} Items
            </span>
          </div>

          <div className="space-y-3">
            {record.aiAnalysis.exposureFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{finding.category}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    finding.severity === 'high'
                      ? 'bg-red-950 text-red-400 border border-red-800/40'
                      : finding.severity === 'medium'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                  }`}>
                    {finding.severity}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  <strong className="text-slate-300">Evidence: </strong>
                  <span>{finding.evidence}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  <strong className="text-slate-300">Impact: </strong>
                  <span>{finding.explanation}</span>
                </div>
                <div className="pt-1.5 text-cyan-300 text-[11px]">
                  <strong>Recommendation: </strong>
                  <span>{finding.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Engineering Attack Scenarios */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Simulated Social Engineering Scenarios
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {record.aiAnalysis.socialEngineeringRisks.length} Scenarios
            </span>
          </div>

          <div className="space-y-3">
            {record.aiAnalysis.socialEngineeringRisks.map((risk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2"
              >
                <span className="font-semibold text-violet-300 block">
                  {risk.attackType}
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {risk.explanation}
                </p>
                <div className="p-2 rounded bg-violet-950/30 border border-violet-800/40 text-violet-200 text-[11px]">
                  <strong className="text-violet-300">Defensive Countermeasure: </strong>
                  <span>{risk.defensiveAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Limitations Disclaimer (Section 7) */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-200">Assessment Boundaries:</strong>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
            {record.aiAnalysis.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  Shield, 
  Calendar, 
  User, 
  FileText,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { AssessmentRecord } from '../types';
import { exportRecordAsJson, exportRecordAsCsv } from '../lib/storage';

interface HistoryViewProps {
  assessments: AssessmentRecord[];
  onSelectAssessment: (record: AssessmentRecord) => void;
  onDeleteAssessment: (id: string) => void;
  onClearHistory: () => void;
  onStartScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  assessments,
  onSelectAssessment,
  onDeleteAssessment,
  onClearHistory,
  onStartScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Low Exposure</span>;
      case 'Moderate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">Moderate Exposure</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">High Exposure</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 border border-red-500/30 text-red-400">Critical Exposure</span>;
    }
  };

  const filtered = assessments
    .filter((rec) => {
      const matchSearch =
        rec.profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = riskFilter === 'all' || rec.riskLevel.toLowerCase() === riskFilter.toLowerCase();
      return matchSearch && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === 'score_high') return b.overallScore - a.overallScore;
      if (sortBy === 'score_low') return a.overallScore - b.overallScore;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <History className="h-3.5 w-3.5" />
            <span>ASSESSMENT ARCHIVE</span>
            <span>·</span>
            <span>LOCAL DEVICE STORAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assessment History & Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, inspect, and export previous digital footprint assessments evaluated on this device.
          </p>
        </div>

        {assessments.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 text-xs font-semibold text-red-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-xl bg-[#0e1628] border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-white">Clear All Assessment History?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all saved assessment records and action plans stored locally in this browser. This operation cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClearOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white cursor-pointer"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by profile handle or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Risk Level Filter */}
        <div className="sm:col-span-4">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Exposure Levels</option>
            <option value="critical">Critical Exposure (75–100)</option>
            <option value="high">High Exposure (50–74)</option>
            <option value="moderate">Moderate Exposure (25–49)</option>
            <option value="low">Low Exposure (0–24)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score_high">Highest Risk Score</option>
            <option value="score_low">Lowest Risk Score</option>
          </select>
        </div>
      </div>

      {/* History Records List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-sm text-white">{record.profileName}</span>
                  {getRiskBadge(record.riskLevel)}
                  {record.isSample && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      Sample
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{new Date(record.timestamp).toLocaleString()}</span>
                  </span>
                  <span>·</span>
                  <span>{record.totalIndicators} flags detected</span>
                  <span>·</span>
                  <span>
                    {record.actionPlan.filter((a) => a.completed).length} of {record.actionPlan.length} safeguards completed
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                  {record.aiAnalysis.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => exportRecordAsJson(record)}
                  title="Export JSON Report"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteAssessment(record.id)}
                  title="Delete Record"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onSelectAssessment(record)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
                >
                  Open Report
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-xl bg-[#0c1220] border border-dashed border-slate-800 space-y-3">
            <User className="h-8 w-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Assessment Records Match</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || riskFilter !== 'all'
                ? 'Try adjusting your search query or exposure filter.'
                : 'Run a digital footprint assessment to begin tracking your privacy posture over time.'}
            </p>
            <button
              onClick={onStartScan}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
            >
              Start Privacy Scan
            </button>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Local Device Privacy: Records are stored strictly within your browser’s localStorage. No passwords or authentication secrets are ever logged.</span>
        </span>
      </div>
    </div>
  );
};

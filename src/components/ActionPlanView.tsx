import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Filter, 
  ArrowRight, 
  Check, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { AssessmentRecord, ActionPlanItem } from '../types';

interface ActionPlanViewProps {
  currentRecord: AssessmentRecord | null;
  onToggleAction: (recordId: string, actionId: string, completed: boolean) => void;
  onStartScan: () => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  currentRecord,
  onToggleAction,
  onStartScan,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  if (!currentRecord) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
          <CheckSquare className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Action Plan Active</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Run a privacy scan or load a simulated profile to generate a customized, prioritized hardening action plan.
        </p>
        <button
          onClick={onStartScan}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-lg hover:brightness-110 cursor-pointer"
        >
          Start Privacy Scan
        </button>
      </div>
    );
  }

  const items = currentRecord.actionPlan;
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (priorityFilter === 'all') return true;
    return item.priority === priorityFilter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950 text-red-400 border border-red-800/40">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950 text-amber-400 border border-amber-800/40">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800/40">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <CheckSquare className="h-3.5 w-3.5" />
          <span>PERSONALIZED HARDENING PLAN</span>
          <span>·</span>
          <span>{currentRecord.profileName}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Privacy Action Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Step-by-step recommendations prioritized to reduce your attack surface and close exposure vectors.
        </p>
      </div>

      {/* Progress Hardening Card */}
      <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Identity Hardening Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {progressPercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({completedCount} of {items.length} safeguards implemented)
              </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="h-2.5 w-full rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>Outstanding work! All prioritized defensive measures have been marked complete.</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredItems.length} of {items.length} recommendations
        </span>
      </div>

      {/* Action Plan Items Checklist */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-xl border transition-all ${
              item.completed
                ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                : 'bg-[#0c1220] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onToggleAction(currentRecord.id, item.id, !item.completed)}
                className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'bg-slate-900 border-slate-700 hover:border-cyan-500 text-transparent'
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </button>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {item.title}
                  </h3>
                  {getPriorityBadge(item.priority)}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.action}
                </p>

                <div className="pt-2 text-[11px] text-cyan-400/90 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Security Impact: {item.impact}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

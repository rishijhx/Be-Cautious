import React from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Clock, 
  ExternalLink, 
  BarChart3, 
  BookOpen, 
  FileText, 
  CheckSquare
} from 'lucide-react';
import { AssessmentRecord, CategoryKey } from '../types';

interface DashboardProps {
  assessments: AssessmentRecord[];
  onStartScan: () => void;
  onSelectAssessment: (record: AssessmentRecord) => void;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  assessments,
  onStartScan,
  onSelectAssessment,
  onNavigate,
}) => {
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;

  // Aggregate statistics calculated purely from actual saved records
  const totalScans = assessments.length;
  const avgScore = totalScans > 0
    ? Math.round(assessments.reduce((acc, curr) => acc + curr.overallScore, 0) / totalScans)
    : 0;
  
  const highPriorityCount = assessments.reduce(
    (acc, curr) => acc + (curr.highPriorityRisks ? curr.highPriorityRisks.length : 0),
    0
  );

  const completedActionsCount = assessments.reduce((acc, curr) => {
    return acc + curr.actionPlan.filter((a) => a.completed).length;
  }, 0);

  const totalActionsCount = assessments.reduce((acc, curr) => {
    return acc + curr.actionPlan.length;
  }, 0);

  const categoryAverages: Record<CategoryKey, { label: string; avg: number }> = {
    identity: { label: 'Identity Info', avg: 0 },
    academic_professional: { label: 'Academic & Work', avg: 0 },
    location_routine: { label: 'Location & Travel', avg: 0 },
    contact_details: { label: 'Contact Details', avg: 0 },
    account_security: { label: 'Account Security', avg: 0 },
    oversharing_habits: { label: 'Oversharing', avg: 0 },
  };

  if (totalScans > 0) {
    (Object.keys(categoryAverages) as CategoryKey[]).forEach((cat) => {
      const sum = assessments.reduce((acc, curr) => acc + (curr.categoryScores[cat]?.score || 0), 0);
      categoryAverages[cat].avg = Math.round(sum / totalScans);
    });
  }

  const getScoreColor = (score: number) => {
    if (score < 25) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score < 50) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    if (score < 75) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  const getRiskLabelBadge = (level: string) => {
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar Header with Primary Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400">INTELLIGENCE CONSOLE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Privacy Risk Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated exposure statistics and security recommendations from your assessments.
          </p>
        </div>

        <button
          onClick={onStartScan}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="h-4 w-4" />
          <span>Start Privacy Scan</span>
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Latest / Overall Score */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Risk Score</span>
            <Shield className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {latestAssessment ? latestAssessment.overallScore : (totalScans > 0 ? avgScore : '—')}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {latestAssessment ? (
              getRiskLabelBadge(latestAssessment.riskLevel)
            ) : (
              <span className="text-[11px] text-slate-500">No scans completed yet</span>
            )}
          </div>
        </div>

        {/* Metric 2: Total Exposure Indicators */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Indicators Detected</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {latestAssessment ? latestAssessment.totalIndicators : 0}
            </span>
            <span className="text-xs text-slate-500">exposure flags</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {highPriorityCount} total critical/high priority risks identified
          </div>
        </div>

        {/* Metric 3: Action Plan Hardening */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Hardening Progress</span>
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {totalActionsCount > 0
                ? `${Math.round((completedActionsCount / totalActionsCount) * 100)}%`
                : '0%'}
            </span>
            <span className="text-xs text-slate-500">
              ({completedActionsCount}/{totalActionsCount})
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-medium">
            Actions implemented
          </div>
        </div>

        {/* Metric 4: Saved Assessments Count */}
        <div className="p-5 rounded-xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Assessed Profiles</span>
            <BarChart3 className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {totalScans}
            </span>
            <span className="text-xs text-slate-500">recorded profiles</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Stored locally on your browser device
          </div>
        </div>
      </div>

      {/* Main Analysis Split: Categories Chart & High Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Category Risk Breakdown */}
        <div className="lg:col-span-7 rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Exposure Categories Breakdown</h2>
              <p className="text-xs text-slate-400">
                {latestAssessment ? `Current scan for: ${latestAssessment.profileName}` : 'Category risk profile based on assessments'}
              </p>
            </div>
            {latestAssessment && (
              <button
                onClick={() => onSelectAssessment(latestAssessment)}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Visualizer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(Object.keys(categoryAverages) as CategoryKey[]).map((cat) => {
              const currentScore = latestAssessment
                ? latestAssessment.categoryScores[cat]?.score || 0
                : categoryAverages[cat].avg;
              const label = categoryAverages[cat].label;

              let barColor = 'bg-emerald-500';
              if (currentScore >= 75) barColor = 'bg-red-500';
              else if (currentScore >= 50) barColor = 'bg-amber-500';
              else if (currentScore >= 25) barColor = 'bg-blue-500';

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{label}</span>
                    <span className="font-mono text-slate-400 tabular-nums font-semibold">
                      {currentScore} / 100
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, currentScore)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low (0–24)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Moderate (25–49)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> High (50–74)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Critical (75–100)
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): High-Priority Privacy Risks */}
        <div className="lg:col-span-5 rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-bold text-white">High-Priority Risks</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {latestAssessment ? latestAssessment.highPriorityRisks.length : 0} Urgent
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {latestAssessment && latestAssessment.highPriorityRisks.length > 0 ? (
                latestAssessment.highPriorityRisks.slice(0, 3).map((risk) => (
                  <div
                    key={risk.id}
                    className="p-3 rounded-lg bg-slate-900/80 border border-red-500/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-300">{risk.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40">
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {risk.detail}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-lg bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">No critical risks flagged</p>
                  <p className="text-[11px] text-slate-500">
                    Run an assessment or load a sample profile to inspect potential exposures.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('action-plan')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full Action Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Test Simulator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Assessments Table */}
      <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Assessments</h2>
            <p className="text-xs text-slate-400">Historical identity scans evaluated on this device</p>
          </div>
          {assessments.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>All History ({assessments.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Profile Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Exposure Level</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assessments.slice(0, 5).map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {rec.profileName}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {rec.isSample ? (
                        <span className="text-cyan-400">Simulated Sample</span>
                      ) : (
                        <span>Custom Assessment</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white tabular-nums">
                      {rec.overallScore} / 100
                    </td>
                    <td className="py-3 px-3">
                      {getRiskLabelBadge(rec.riskLevel)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(rec.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectAssessment(rec)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Open Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center space-y-3 border border-dashed border-slate-800 rounded-lg">
            <User className="h-8 w-8 text-slate-600 mx-auto" />
            <div className="text-xs text-slate-400">No assessments completed yet.</div>
            <button
              onClick={onStartScan}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              Run Your First Scan
            </button>
          </div>
        )}
      </div>

      {/* "Learn to Stay Safe" Section */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-[#0e1628] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">Learn to Stay Safe: Defensive Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">Delayed Travel Sharing</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Never broadcast live flight boarding, hotel check-ins, or vacation schedules. Post retrospectives after you are safely back.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">Redact Official Documents</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Before celebrating diplomas, licenses, or passes online, obscure barcodes, registration IDs, signatures, and addresses.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-cyan-300 block">Out-of-Band Verification</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When receiving an unexpected urgent message from a dean, manager, or recruiter, verify via a known telephone number or internal intranet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

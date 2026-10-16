import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  ArrowRight, 
  Terminal, 
  UserCheck, 
  Lock,
  Mail,
  MessageSquare,
  Smartphone,
  Linkedin
} from 'lucide-react';
import { SIMULATOR_SCENARIOS } from '../lib/simulatorScenarios';
import { SimulatorScenario } from '../types';

export const SocialEngineeringSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SIMULATOR_SCENARIOS[0].id);
  const [activeRedFlagIndex, setActiveRedFlagIndex] = useState<number | null>(null);

  const scenario: SimulatorScenario = 
    SIMULATOR_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATOR_SCENARIOS[0];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4 text-cyan-400" />;
      case 'Email':
        return <Mail className="h-4 w-4 text-blue-400" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4 text-amber-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-violet-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Awareness Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>EDUCATIONAL AWARENESS MODULE</span>
          <span>·</span>
          <span>SIMULATED SCENARIOS ONLY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Social Engineering Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Explore how real attackers piece together public breadcrumbs to stage believable pretexting and phishing attacks. Click highlighted red flags in the simulated messages to understand their psychological traps.
        </p>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SIMULATOR_SCENARIOS.map((sc) => {
          const isSelected = sc.id === scenario.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setActiveRedFlagIndex(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/40'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  {getChannelIcon(sc.simulatedMessage.channel)}
                  <span>{sc.simulatedMessage.channel}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">SIMULATED</span>
              </div>
              <h3 className="font-semibold text-xs text-white line-clamp-1">{sc.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                Target: {sc.targetRole}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport: Message Inspector & Attack Anatomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): The Simulated Message with Interactive Red Flags */}
        <div className="lg:col-span-7 rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {getChannelIcon(scenario.simulatedMessage.channel)}
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulated {scenario.simulatedMessage.channel} Message
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
              Interactive Red Flags
            </span>
          </div>

          {/* Email / Message Header */}
          <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-16">Sender:</span>
              <span className="text-slate-200">{scenario.simulatedMessage.sender}</span>
            </div>
            {scenario.simulatedMessage.subject && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">Subject:</span>
                <span className="text-cyan-300 font-semibold">{scenario.simulatedMessage.subject}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-16">Security:</span>
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> External origin / Unverified signature
              </span>
            </div>
          </div>

          {/* Message Body with Clickable Red Flags */}
          <div className="p-5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
            {scenario.simulatedMessage.body}
          </div>

          {/* Red Flag Inspector Accordion */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Click a Red Flag to inspect why it is dangerous:
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {scenario.simulatedMessage.redFlags.length} Deceptions Planted
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {scenario.simulatedMessage.redFlags.map((rf, idx) => {
                const isActive = activeRedFlagIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveRedFlagIndex(isActive ? null : idx)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-amber-950/30'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                        "{rf.phrase}"
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isActive ? 'Hide Reason' : 'Inspect'}
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-2 text-[11px] text-slate-300 leading-relaxed pl-5 border-l-2 border-amber-500/60">
                        {rf.reason}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Attack Anatomy & Verification */}
        <div className="lg:col-span-5 space-y-6">
          {/* Public Data Involved */}
          <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Eye className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Public OSINT Leveraged
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {scenario.publicDataInvolved.map((dataItem, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{dataItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Psychological Tactic */}
          <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Terminal className="h-4 w-4 text-violet-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Psychological Manipulation Tactic
              </h3>
            </div>
            <div>
              <span className="text-xs font-bold text-violet-300 block mb-1">
                {scenario.psychologicalTactic}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {scenario.tacticExplanation}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-xs">
              <strong className="text-slate-300 block mb-0.5">Why it works:</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {scenario.believabilityFactor}
              </p>
            </div>
          </div>

          {/* Defensive Verification Protocol */}
          <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                How to Independently Verify
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {scenario.defensiveVerification.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

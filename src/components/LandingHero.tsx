import React from 'react';
import { Shield, Sparkles, UserCheck, AlertTriangle, ArrowRight, Eye, CheckCircle2, Lock } from 'lucide-react';

interface LandingHeroProps {
  onStartScan: () => void;
  onExploreDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartScan, onExploreDemo }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-xs font-medium">
              <Shield className="h-3.5 w-3.5" />
              <span>UNPHISHABLE Social Engineering Awareness Challenge</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Spot the Scam <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                Before It Spots You.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Discover what your online presence reveals, understand your privacy risks, and take control before someone exploits your information.
            </p>

            {/* Core Message callout */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-semibold text-cyan-300 block mb-0.5">Core Principle</span>
                <span>Your data tells a story. Make sure it doesn't tell the wrong person.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" />
                <span>Analyze My Digital Footprint</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>

              <button
                onClick={onExploreDemo}
                className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                <UserCheck className="h-4 w-4 text-cyan-400" />
                <span>Explore a Demo</span>
              </button>
            </div>

            {/* Trust markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Zero-Password Request</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Deterministic Scoring Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Gemini AI Recon Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Simulated Reconnaissance Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-[#0d1322]/90 p-6 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">recon_intelligence.json</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  LIVE MODEL
                </span>
              </div>

              {/* Simulated Footprint Nodes */}
              <div className="py-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <Eye className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-300">Public Affiliation</span>
                  </div>
                  <span className="text-amber-400 font-medium">State Tech CS Dept</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-slate-300">Unredacted Cert ID</span>
                  </div>
                  <span className="text-red-400 font-medium">#CSA-98214-STU</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-violet-400" />
                    <span className="text-slate-300">Social Engineering Vector</span>
                  </div>
                  <span className="text-violet-300 font-medium">Recruiter Pretexting</span>
                </div>

                {/* Score Preview Banner */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Potential Risk Score</span>
                    <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">68<span className="text-xs text-slate-500"> / 100</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-red-400 font-semibold block">High Exposure</span>
                    <span className="text-[11px] text-slate-500">6 Indicators Detected</span>
                  </div>
                </div>
              </div>

              {/* Explanatory footer */}
              <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 leading-snug">
                Demonstrates how seemingly harmless publicly posted details interlock to build a targeted attack persona.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

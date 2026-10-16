import React from 'react';
import { Search, Compass, ShieldCheck, AlertCircle, Terminal, UserCheck, ShieldAlert, FileText, Check } from 'lucide-react';

interface EducationalSectionProps {
  onStartScan: () => void;
  onExploreDemo: () => void;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({ onStartScan, onExploreDemo }) => {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Why Digital Footprints Matter */}
      <section>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2 block">
            The Digital Exposure Landscape
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Digital Footprints Matter
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Every conference check-in, unredacted certificate photo, travel announcement, and recycled username leaves digital breadcrumbs. Individually they seem harmless; combined, they form a detailed blueprint for social engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Automated OSINT Scraping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adversaries and bot networks continuously index public social profiles, GitHub commits, and academic registries to aggregate fragmented personal data without you ever knowing.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Pretexting & Credibility</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a phisher cites your real college department, your manager’s name, or a conference you are attending, your brain’s natural fraud alarms are disarmed by familiar context.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Credential Correlation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Using the same handle across 6 platforms allows cross-referencing against past public data breaches, turning a casual hobby forum post into a doorway to your primary email.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Three-Step Workflow: Assess, Understand, Protect */}
      <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#0a0f1d] border border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2 block">
            Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Be Cautious Works
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            A transparent three-step security workflow built for proactive digital hygiene.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-base shadow-lg shadow-cyan-500/20">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Assess Exposure</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete a guided questionnaire covering public profile fields, travel posting habits, credential hygiene, and an optional public post snippet.
            </p>
            <div className="text-xs text-cyan-400/90 font-medium flex items-center gap-1.5 pt-1">
              <Check className="h-3.5 w-3.5" />
              <span>Zero passwords or private credentials requested</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white font-mono font-bold text-base shadow-lg shadow-blue-500/20">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Understand Exploits</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The dual-engine analyzer (deterministic rules + server-side Gemini AI) evaluates risk factors across 6 categories, calculating a normalized 0–100 privacy score and mapping specific attack vectors.
            </p>
            <div className="text-xs text-blue-400/90 font-medium flex items-center gap-1.5 pt-1">
              <Check className="h-3.5 w-3.5" />
              <span>Reveals exact psychological attack mechanisms</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-base shadow-lg shadow-emerald-500/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Protect Identity</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive a prioritized action plan tailored to your profile. Check off implemented safeguards, track your hardening progress, and test your recognition skills in the simulator.
            </p>
            <div className="text-xs text-emerald-400/90 font-medium flex items-center gap-1.5 pt-1">
              <Check className="h-3.5 w-3.5" />
              <span>Exportable audit reports in JSON and CSV</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sample Privacy Report Preview */}
      <section>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1 block">
              Transparent Reporting
            </span>
            <h2 className="text-2xl font-bold text-white">Sample Privacy Risk Report</h2>
            <p className="text-xs text-slate-400 mt-1">
              Example output generated for Maya Patel (Student Persona)
            </p>
          </div>
          <button
            onClick={onExploreDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Load Interactive Sample</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0b101d] p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Assessed Profile</span>
              <h3 className="text-base font-bold text-white">Maya Patel · State Tech CS Dept</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Overall Privacy Score</span>
                <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">58 / 100</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                High Risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Top Exposure Finding</span>
              <p className="text-slate-200 font-medium">Unredacted Cloud Security Certificate ID #CSA-98214-STU shared publicly.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Simulated Attack Vector</span>
              <p className="text-slate-200 font-medium">Fast-track recruiter phishing quoting exam ID and conference destination.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Immediate Defense</span>
              <p className="text-slate-200 font-medium">Blur document numbers; enforce TOTP authenticator app on student SSO.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Limitations Section */}
      <section className="rounded-xl border border-slate-800/80 bg-[#080d1a] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <AlertCircle className="h-5 w-5" />
          <h3 className="text-base font-bold text-white">Educational Privacy Pledge & System Limitations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-100">What Be Cautious Does:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Evaluates self-reported visibility settings and habit indicators to calculate educational risk scores.</li>
              <li>Simulates how social engineers combine public information to craft realistic pretexting attacks.</li>
              <li>Generates actionable privacy hardening steps you can complete and track locally.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-100">What Be Cautious Does NOT Do:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Does NOT collect passwords, OTPs, financial details, or government identification numbers.</li>
              <li>Does NOT claim to perform live continuous surveillance of the public internet.</li>
              <li>Does NOT assert that your account has been breached without evidence; all attack scenarios are hypothetical educational simulations.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

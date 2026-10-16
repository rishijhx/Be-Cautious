import React from 'react';
import { Shield, Lock, Info, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060912] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Core Message */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="font-bold text-base tracking-tight">Be Cautious</span>
            </div>
            <p className="text-sm text-cyan-300 font-medium">
              “Your data tells a story. Make sure it doesn't tell the wrong person.”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A proactive social engineering defense and digital privacy risk intelligence platform developed for the 
              <strong className="text-slate-200"> UNPHISHABLE Social Engineering Awareness Challenge</strong>.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Privacy by Design: Assessments execute locally or via secure server proxy. No credentials collected.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-cyan-400 transition-colors">
                  Overview & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Privacy Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scanner')} className="hover:text-cyan-400 transition-colors">
                  Digital Footprint Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulator')} className="hover:text-cyan-400 transition-colors">
                  Social Engineering Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('action-plan')} className="hover:text-cyan-400 transition-colors">
                  Personalized Action Plan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-cyan-400 transition-colors">
                  Assessment History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Educational Scope & Defense */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Awareness & Scope</h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>
                This tool is an educational risk simulator evaluating user-submitted habits and public profile disclosures.
              </p>
              <p>
                It does not scrape external social networks or perform non-consensual surveillance.
              </p>
              <div className="pt-2 text-slate-500 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                <span>UNPHISHABLE Hackathon 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Be Cautious · Understand Your Exposure. Protect Your Identity.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strictly Non-Credential Assessment</span>
            <span>·</span>
            <span className="text-slate-400">Educational Cyber Defense</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

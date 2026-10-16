import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  User, 
  Lock, 
  Building2, 
  MapPin, 
  Calendar, 
  Mail, 
  Plane, 
  FileCheck2, 
  KeyRound, 
  Info, 
  Check, 
  ArrowRight,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { ProfileAssessmentInput, AssessmentRecord } from '../types';
import { SAMPLE_PROFILES, SampleProfileItem } from '../lib/sampleProfiles';
import { evaluateDeterministicRisk } from '../lib/riskEngine';
import { analyzePrivacyFootprint } from '../lib/api';

interface ScannerProps {
  onAssessmentComplete: (record: AssessmentRecord) => void;
  geminiActive: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onAssessmentComplete, geminiActive }) => {
  const [formData, setFormData] = useState<ProfileAssessmentInput>({
    profileName: '',
    profileVisibility: 'public',
    revealsInstitution: false,
    institutionName: '',
    revealsContactInfo: false,
    contactDetailsVisible: [],
    revealsLocationRoutine: false,
    revealsBirthdateMilestones: false,
    postsTravelRealtime: false,
    sharesUnredactedScreenshots: false,
    sharesCertsOrIDs: false,
    postsFamilyColleagues: false,
    reusesUsernames: false,
    sharesProjectDetails: false,
    reusesPasswords: 'some_secondary_sites',
    mfaEnabled: 'some_accounts',
    reviewsPrivacySettings: 'rarely',
    acceptsUnknownRequests: 'sometimes',
    clicksUnexpectedLinks: 'rarely',
    sharesWithUnverifiedContacts: false,
    sanitizedPostText: '',
  });

  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(false);
  const [sampleType, setSampleType] = useState<'student' | 'professional' | 'privacy_conscious' | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toggle contact channels
  const toggleContactChannel = (channel: string) => {
    setFormData((prev) => {
      const exists = prev.contactDetailsVisible.includes(channel);
      const updated = exists
        ? prev.contactDetailsVisible.filter((c) => c !== channel)
        : [...prev.contactDetailsVisible, channel];
      return {
        ...prev,
        contactDetailsVisible: updated,
        revealsContactInfo: updated.length > 0,
      };
    });
  };

  const handleLoadSample = (sample: SampleProfileItem) => {
    setFormData(sample.data);
    setIsSampleLoaded(true);
    setSampleType(sample.id);
    setErrorMsg(null);
  };

  const handleResetForm = () => {
    setFormData({
      profileName: '',
      profileVisibility: 'public',
      revealsInstitution: false,
      institutionName: '',
      revealsContactInfo: false,
      contactDetailsVisible: [],
      revealsLocationRoutine: false,
      revealsBirthdateMilestones: false,
      postsTravelRealtime: false,
      sharesUnredactedScreenshots: false,
      sharesCertsOrIDs: false,
      postsFamilyColleagues: false,
      reusesUsernames: false,
      sharesProjectDetails: false,
      reusesPasswords: 'some_secondary_sites',
      mfaEnabled: 'some_accounts',
      reviewsPrivacySettings: 'rarely',
      acceptsUnknownRequests: 'sometimes',
      clicksUnexpectedLinks: 'rarely',
      sharesWithUnverifiedContacts: false,
      sanitizedPostText: '',
    });
    setIsSampleLoaded(false);
    setSampleType(undefined);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = formData.profileName.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter a display name or simulated handle to label this assessment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Evaluate deterministic risk engine immediately
      const deterministicResult = evaluateDeterministicRisk(formData, {
        isSample: isSampleLoaded,
        sampleType,
      });

      // 2. Call server-side AI Privacy Analysis (or fallback)
      const aiAnalysis = await analyzePrivacyFootprint(
        formData,
        deterministicResult.categoryScores
      );

      // 3. Assemble complete record
      const fullRecord: AssessmentRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        ...deterministicResult,
        aiAnalysis,
      };

      onAssessmentComplete(fullRecord);
    } catch (err: any) {
      console.error('Assessment evaluation error:', err);
      setErrorMsg('An unexpected error occurred while analyzing the digital footprint. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Shield className="h-3.5 w-3.5" />
          <span>INTERACTIVE ASSESSMENT SCANNER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Digital Identity Exposure Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Evaluate public profile exposure, online sharing habits, and security practices to uncover potential social engineering attack vectors.
        </p>
      </div>

      {/* Quick-Fill Sample Profiles (Requirement #13) */}
      <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick-Fill Simulated Personas
            </h2>
          </div>
          {isSampleLoaded && (
            <button
              onClick={handleResetForm}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset to Blank</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Choose a pre-configured scenario to demonstrate the risk engine with realistic data:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {SAMPLE_PROFILES.map((sample) => {
            const isSelected = sampleType === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-100 shadow-md shadow-cyan-950/50'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white">{sample.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {sample.id === 'student' ? 'Student' : sample.id === 'professional' ? 'Corporate' : 'Hardened'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {sample.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section A: Public Profile Information */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              A. Public Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Profile Name / Handle */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-medium text-slate-200">
                Public Name or Profile Handle <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={formData.profileName}
                onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                placeholder="e.g. Alex Chen (@alex_chen_dev)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
              <span className="text-[11px] text-slate-500">
                You can use an alias, handle, or fictional name. Real legal names are never required.
              </span>
            </div>

            {/* Profile Visibility */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-medium text-slate-200">Profile Visibility Setting</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'public', label: 'Public to Everyone', desc: 'Indexed by search engines & visitors' },
                  { id: 'partially_restricted', label: 'Partially Restricted', desc: 'Friends of friends or partial bio' },
                  { id: 'private', label: 'Private / Closed', desc: 'Approved connections only' },
                ].map((vis) => (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, profileVisibility: vis.id as any })}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      formData.profileVisibility === vis.id
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-0.5">{vis.label}</div>
                    <div className="text-[11px] text-slate-500">{vis.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Educational / Workplace Affiliation */}
            <div className="space-y-3 sm:col-span-2 p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.revealsInstitution}
                  onChange={(e) => setFormData({ ...formData, revealsInstitution: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-200 font-medium">
                  Profile visibly reveals College, University, Employer, or Organization
                </span>
              </label>

              {formData.revealsInstitution && (
                <div className="pl-7 space-y-1">
                  <input
                    type="text"
                    value={formData.institutionName || ''}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="e.g. State Tech University, Acme Fintech Corp, etc."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500">
                    Used to evaluate academic and corporate pretexting susceptibility.
                  </span>
                </div>
              )}
            </div>

            {/* Contact Details Channels */}
            <div className="space-y-2 sm:col-span-2 p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <label className="font-medium text-slate-200 block mb-2">
                Publicly Visible Contact Channels (select all that apply):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Direct Email', 'Mobile Phone', 'Discord / Telegram', 'Personal Website URL'].map((channel) => {
                  const checked = formData.contactDetailsVisible.includes(channel);
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleContactChannel(channel)}
                      className={`px-3 py-2 rounded-lg border text-xs text-left flex items-center justify-between cursor-pointer transition-all ${
                        checked
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{channel}</span>
                      {checked && <Check className="h-3 w-3 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Routine */}
            <div className="space-y-2 p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.revealsLocationRoutine}
                  onChange={(e) => setFormData({ ...formData, revealsLocationRoutine: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-200 font-medium">
                  Reveals City, Neighborhood, or Commute Routine
                </span>
              </label>
              <p className="text-[11px] text-slate-500 pl-7">
                Regular check-ins at gyms, cafes, or commute hubs.
              </p>
            </div>

            {/* Birthdays & Milestones */}
            <div className="space-y-2 p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.revealsBirthdateMilestones}
                  onChange={(e) => setFormData({ ...formData, revealsBirthdateMilestones: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-200 font-medium">
                  Publicly Displays Birthday or Anniversary Milestones
                </span>
              </label>
              <p className="text-[11px] text-slate-500 pl-7">
                Exact day or birth year used in verification questions.
              </p>
            </div>
          </div>
        </div>

        {/* Section B: Online Sharing Habits */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Plane className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              B. Online Sharing Habits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              {
                id: 'postsTravelRealtime',
                label: 'Posts Travel Updates in Real-Time',
                desc: 'Sharing airport boarding passes, hotel check-ins, or vacation photos while still away.',
                checked: formData.postsTravelRealtime,
                field: 'postsTravelRealtime' as const,
              },
              {
                id: 'sharesCertsOrIDs',
                label: 'Shares Certificates or Badges Unredacted',
                desc: 'Posting exam certs, diplomas, or conference badges without blurring IDs or barcodes.',
                checked: formData.sharesCertsOrIDs,
                field: 'sharesCertsOrIDs' as const,
              },
              {
                id: 'sharesUnredactedScreenshots',
                label: 'Posts Screenshots with Browser Tabs / Metadata',
                desc: 'Sharing screen captures where internal URLs, bookmarks, or sensitive tabs are visible.',
                checked: formData.sharesUnredactedScreenshots,
                field: 'sharesUnredactedScreenshots' as const,
              },
              {
                id: 'postsFamilyColleagues',
                label: 'Tags Family Members, Children, or Colleagues',
                desc: 'Publicly connecting family relations or organizational hierarchies on social feeds.',
                checked: formData.postsFamilyColleagues,
                field: 'postsFamilyColleagues' as const,
              },
              {
                id: 'reusesUsernames',
                label: 'Reuses Same Username Across Multiple Sites',
                desc: 'Using identical handle across GitHub, gaming accounts, Reddit, and LinkedIn.',
                checked: formData.reusesUsernames,
                field: 'reusesUsernames' as const,
              },
              {
                id: 'sharesProjectDetails',
                label: 'Publicly Discusses Internal Projects / Tech Stacks',
                desc: 'Naming internal tools, pending deadlines, or architecture vendors online.',
                checked: formData.sharesProjectDetails,
                field: 'sharesProjectDetails' as const,
              },
            ].map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all ${
                  item.checked
                    ? 'border-amber-500/50 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => setFormData({ ...formData, [item.field]: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block mb-0.5">{item.label}</span>
                    <span className="text-[11px] text-slate-400 leading-snug">{item.desc}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Account Security Habits */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <KeyRound className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              C. Account Security Habits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Password Reuse */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-200">Password Reuse Practice</label>
              <select
                value={formData.reusesPasswords}
                onChange={(e) => setFormData({ ...formData, reusesPasswords: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="never">Never (Unique password per account via manager)</option>
                <option value="some_secondary_sites">Variations on secondary / non-critical sites</option>
                <option value="frequently">Frequently (Same 1–2 passwords across accounts)</option>
              </select>
            </div>

            {/* MFA Status */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-200">Multi-Factor Authentication (MFA)</label>
              <select
                value={formData.mfaEnabled}
                onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all_accounts">Enforced on all major email, social & bank accounts</option>
                <option value="some_accounts">Active on some accounts, inactive on others</option>
                <option value="none">Not enabled or only SMS on a few services</option>
              </select>
            </div>

            {/* Review Privacy Settings */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-200">Privacy Settings Review Cadence</label>
              <select
                value={formData.reviewsPrivacySettings}
                onChange={(e) => setFormData({ ...formData, reviewsPrivacySettings: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="regularly">Regularly (Audited every 3–6 months)</option>
                <option value="rarely">Rarely (Only when prompted by platform notices)</option>
                <option value="never">Never (Default settings left unchanged)</option>
              </select>
            </div>

            {/* Unknown Connections */}
            <div className="space-y-1.5">
              <label className="font-medium text-slate-200">Accepting Unknown Connection Requests</label>
              <select
                value={formData.acceptsUnknownRequests}
                onChange={(e) => setFormData({ ...formData, acceptsUnknownRequests: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="never">Never (Strictly verified contacts only)</option>
                <option value="sometimes">Sometimes (If they appear to share industry/peers)</option>
                <option value="frequently">Frequently (To expand professional network reach)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section D: Optional Public Post / Bio Analysis */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCheck2 className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              D. Optional Public Text Analysis
            </h2>
          </div>

          {/* Explicit Warning Callout (Required by Section 5) */}
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-300">Privacy & Safety Notice:</strong>
              Do NOT paste passwords, one-time codes (OTPs), government ID numbers, financial account details, or private conversations. Only paste public bio snippets, forum posts, or public status updates.
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200">
              Sample Public Bio, Status, or LinkedIn Post (Optional)
            </label>
            <textarea
              rows={4}
              value={formData.sanitizedPostText || ''}
              onChange={(e) => setFormData({ ...formData, sanitizedPostText: e.target.value })}
              placeholder="Paste a sanitized excerpt from a public social bio, job update, or status update here..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs leading-relaxed"
            />
            <span className="text-[11px] text-slate-500 block">
              Evaluated for OSINT reconnaissance breadcrumbs and automated impersonation pretexts.
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Dual Evaluation: Deterministic Risk Engine + Server-Side Gemini AI Recon</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analyzing Digital Footprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Privacy & Risk Analysis</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

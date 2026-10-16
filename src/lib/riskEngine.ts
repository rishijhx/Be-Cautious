import {
  ProfileAssessmentInput,
  AssessmentRecord,
  CategoryKey,
  CategoryScoreDetail,
  RiskLevel,
  ScoredFactor,
  ActionPlanItem,
  AiPrivacyAnalysis,
} from '../types';

export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Critical';
}

export function evaluateDeterministicRisk(
  inputs: ProfileAssessmentInput,
  options?: { isSample?: boolean; sampleType?: 'student' | 'professional' | 'privacy_conscious' }
): Omit<AssessmentRecord, 'id' | 'timestamp' | 'aiAnalysis'> {
  const factors: ScoredFactor[] = [];
  const categoryRawScores: Record<CategoryKey, { current: number; max: number }> = {
    identity: { current: 0, max: 20 },
    academic_professional: { current: 0, max: 15 },
    location_routine: { current: 0, max: 20 },
    contact_details: { current: 0, max: 15 },
    account_security: { current: 0, max: 30 },
    oversharing_habits: { current: 0, max: 20 },
  };

  // 1. Profile Visibility
  if (inputs.profileVisibility === 'public') {
    categoryRawScores.identity.current += 12;
    factors.push({
      id: 'vis_public',
      category: 'identity',
      label: 'Completely Public Profile',
      riskPoints: 12,
      status: 'danger',
      explanation: 'Your profile bio, connections, and updates can be indexed by search engines and scrapers without authentication.',
      remedy: 'Switch sensitive social profiles to private or friends-only, and audit search engine visibility settings.',
    });
  } else if (inputs.profileVisibility === 'partially_restricted') {
    categoryRawScores.identity.current += 5;
    factors.push({
      id: 'vis_partial',
      category: 'identity',
      label: 'Partially Restricted Visibility',
      riskPoints: 5,
      status: 'warning',
      explanation: 'Certain profile fields remain discoverable by friends-of-friends or connected third-party applications.',
      remedy: 'Review audience selectors for past posts and limit visibility of profile details to direct contacts.',
    });
  } else {
    factors.push({
      id: 'vis_private',
      category: 'identity',
      label: 'Private Profile Boundary',
      riskPoints: 0,
      status: 'safe',
      explanation: 'Restricted profile visibility limits reconnaissance from unapproved observers.',
      remedy: 'Maintain vigilance over pending follower requests.',
    });
  }

  // 2. Birthdays & Milestones
  if (inputs.revealsBirthdateMilestones) {
    categoryRawScores.identity.current += 8;
    factors.push({
      id: 'birthdate_visible',
      category: 'identity',
      label: 'Public Birthday or Personal Milestones',
      riskPoints: 8,
      status: 'danger',
      explanation: 'Birthdates and milestone years are frequently used as secondary security verification questions or identity corroborators.',
      remedy: 'Hide birth year and exact date from public profiles; celebrate privately or limit audience to close friends.',
    });
  }

  // 3. Academic & Professional Exposure
  if (inputs.revealsInstitution) {
    categoryRawScores.academic_professional.current += 8;
    factors.push({
      id: 'institution_visible',
      category: 'academic_professional',
      label: 'Public College or Employer Affiliation',
      riskPoints: 8,
      status: 'warning',
      explanation: `Revealing your institution${inputs.institutionName ? ` (${inputs.institutionName})` : ''} enables attackers to craft pretexting emails referencing specific campus departments, managers, or internal portals.`,
      remedy: 'Limit public disclosure of internal teams or department names, and verify any unexpected administrative emails.',
    });
  }

  if (inputs.sharesProjectDetails) {
    categoryRawScores.academic_professional.current += 7;
    factors.push({
      id: 'projects_visible',
      category: 'academic_professional',
      label: 'Public Internal Project or Tech Stack Details',
      riskPoints: 7,
      status: 'warning',
      explanation: 'Specific tools, vendors, or project timelines help attackers construct authoritative phishing scenarios.',
      remedy: 'Generalize portfolio accomplishments without naming internal client repositories, tools, or pending release schedules.',
    });
  }

  // 4. Location & Routine Exposure
  if (inputs.postsTravelRealtime) {
    categoryRawScores.location_routine.current += 12;
    factors.push({
      id: 'travel_realtime',
      category: 'location_routine',
      label: 'Real-Time Travel and Departure Updates',
      riskPoints: 12,
      status: 'danger',
      explanation: 'Announcing departures, airport check-ins, or hotel tags broadcasts that your residence is unoccupied and makes emergency family imposter scams highly credible.',
      remedy: 'Adopt the "post after returning" habit for trips, vacations, and flight tickets.',
    });
  }

  if (inputs.revealsLocationRoutine) {
    categoryRawScores.location_routine.current += 8;
    factors.push({
      id: 'routine_visible',
      category: 'location_routine',
      label: 'Predictable Commute, Gym, or Neighborhood Routine',
      riskPoints: 8,
      status: 'warning',
      explanation: 'Consistent check-ins establish routine patterns that facilitate physical tracking or tailored social engineering approaches.',
      remedy: 'Disable automatic location tagging in photo uploads and delay posting daily routine destinations.',
    });
  }

  // 5. Contact Information Exposure
  if (inputs.revealsContactInfo) {
    const contactCount = inputs.contactDetailsVisible.length || 1;
    const pts = Math.min(15, contactCount * 5);
    categoryRawScores.contact_details.current += pts;
    factors.push({
      id: 'contact_visible',
      category: 'contact_details',
      label: `Exposed Direct Contact Channels (${inputs.contactDetailsVisible.join(', ') || 'Direct contact'})`,
      riskPoints: pts,
      status: pts >= 10 ? 'danger' : 'warning',
      explanation: 'Publicly exposed personal phone numbers or direct email addresses expose you to automated SMS smishing, voice vishing, and spam lists.',
      remedy: 'Use contact forms, masked aliases (e.g. SimpleLogin or iCloud Hide My Email), or business-specific secondary channels.',
    });
  }

  // 6. Account Security Habits
  if (inputs.reusesPasswords === 'frequently') {
    categoryRawScores.account_security.current += 15;
    factors.push({
      id: 'pw_reuse_freq',
      category: 'account_security',
      label: 'Frequent Password Reuse Across Accounts',
      riskPoints: 15,
      status: 'danger',
      explanation: 'If a single low-security forum or hobby site is breached, credential-stuffing tools automatically test those credentials on your email, banking, and school logins.',
      remedy: 'Install an encrypted password manager and generate unique 16+ character passwords for every single service.',
    });
  } else if (inputs.reusesPasswords === 'some_secondary_sites') {
    categoryRawScores.account_security.current += 8;
    factors.push({
      id: 'pw_reuse_secondary',
      category: 'account_security',
      label: 'Password Variations on Secondary Sites',
      riskPoints: 8,
      status: 'warning',
      explanation: 'Attackers use permutation dictionaries to guess primary accounts from leaked secondary passwords.',
      remedy: 'Ensure core email and academic/work accounts never share base passwords with secondary websites.',
    });
  }

  if (inputs.mfaEnabled === 'none') {
    categoryRawScores.account_security.current += 10;
    factors.push({
      id: 'mfa_none',
      category: 'account_security',
      label: 'No Multi-Factor Authentication (MFA)',
      riskPoints: 10,
      status: 'danger',
      explanation: 'Accounts protected solely by a password are exponentially more vulnerable to brute-force, phishing, and leaked credential attacks.',
      remedy: 'Activate app-based MFA (e.g. Google Authenticator or hardware FIDO keys) on email, social media, and banking.',
    });
  } else if (inputs.mfaEnabled === 'some_accounts') {
    categoryRawScores.account_security.current += 4;
    factors.push({
      id: 'mfa_partial',
      category: 'account_security',
      label: 'Inconsistent Multi-Factor Authentication',
      riskPoints: 4,
      status: 'warning',
      explanation: 'Secondary or legacy accounts without MFA can serve as stepping stones into personal ecosystems.',
      remedy: 'Audit and enforce 2FA across all connected cloud storage and secondary communication platforms.',
    });
  }

  if (inputs.acceptsUnknownRequests === 'frequently') {
    categoryRawScores.account_security.current += 5;
    factors.push({
      id: 'accepts_unknown',
      category: 'account_security',
      label: 'Accepting Unknown Connection Requests',
      riskPoints: 5,
      status: 'danger',
      explanation: 'Fraudulent recruiter and peer profiles connect with victims specifically to map their network and send weaponized links.',
      remedy: 'Inspect connection profiles for genuine mutual connections, tenure, and suspicious activity before accepting.',
    });
  }

  if (inputs.clicksUnexpectedLinks === 'sometimes') {
    categoryRawScores.account_security.current += 5;
    factors.push({
      id: 'clicks_links',
      category: 'account_security',
      label: 'Clicking Links in Unexpected Messages',
      riskPoints: 5,
      status: 'warning',
      explanation: 'Opening unsolicited links in SMS, Discord, or LinkedIn DMs circumvents email gateway protections.',
      remedy: 'Navigate directly to official web portals rather than clicking links inside urgency-driven notifications.',
    });
  }

  // 7. Oversharing Habits
  if (inputs.sharesCertsOrIDs) {
    categoryRawScores.oversharing_habits.current += 8;
    factors.push({
      id: 'unredacted_certs',
      category: 'oversharing_habits',
      label: 'Unredacted Certification, Badge, or ID Photos',
      riskPoints: 8,
      status: 'danger',
      explanation: 'Certificates often include student IDs, registration numbers, QR codes, or barcodes that attackers use to bypass verification portals or claim impersonation.',
      remedy: 'Blur or crop out document IDs, barcodes, issue numbers, and signatures before sharing achievement photos.',
    });
  }

  if (inputs.sharesUnredactedScreenshots) {
    categoryRawScores.oversharing_habits.current += 6;
    factors.push({
      id: 'unredacted_screenshots',
      category: 'oversharing_habits',
      label: 'Screenshots Revealing Sensitive Metadata',
      riskPoints: 6,
      status: 'warning',
      explanation: 'Browser tabs, bookmarks, internal URLs, or chat snippets visible in screenshots leak sensitive operational breadcrumbs.',
      remedy: 'Crop screenshots strictly to the subject matter and blur background browser bars and notification popups.',
    });
  }

  if (inputs.reusesUsernames) {
    categoryRawScores.oversharing_habits.current += 5;
    factors.push({
      id: 'reuses_handles',
      category: 'oversharing_habits',
      label: 'Identical Username Across All Platforms',
      riskPoints: 5,
      status: 'warning',
      explanation: 'OSINT (Open-Source Intelligence) tools can correlate your coding repositories, gaming accounts, social profiles, and forums within seconds using identical handles.',
      remedy: 'Separate professional handles from personal and hobby profiles to prevent comprehensive cross-profiling.',
    });
  }

  if (inputs.postsFamilyColleagues) {
    categoryRawScores.oversharing_habits.current += 4;
    factors.push({
      id: 'family_tagged',
      category: 'oversharing_habits',
      label: 'Public Family, Colleague, or Relationship Tagging',
      riskPoints: 4,
      status: 'warning',
      explanation: 'Family and colleague names give scammers convincing pretexts for "emergency bail", "invoice approval", or grandparent scams.',
      remedy: 'Limit public relationship tags and establish an offline family safe-word for emergency financial requests.',
    });
  }

  // Category Score Calculations (normalized 0 - 100 per category)
  const categoryScores: Record<CategoryKey, CategoryScoreDetail> = {
    identity: {
      category: 'identity',
      label: 'Identity Information',
      score: Math.min(100, Math.round((categoryRawScores.identity.current / categoryRawScores.identity.max) * 100)),
      maxScore: 100,
      weight: 0.20,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.identity.current / categoryRawScores.identity.max) * 100))),
      description: 'Public profile visibility, names, birthdates, and biographical identifiers.',
      findingsCount: factors.filter(f => f.category === 'identity' && f.status !== 'safe').length,
    },
    academic_professional: {
      category: 'academic_professional',
      label: 'Academic & Professional',
      score: Math.min(100, Math.round((categoryRawScores.academic_professional.current / categoryRawScores.academic_professional.max) * 100)),
      maxScore: 100,
      weight: 0.15,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.academic_professional.current / categoryRawScores.academic_professional.max) * 100))),
      description: 'College, employer, organizational affiliations, and technical project details.',
      findingsCount: factors.filter(f => f.category === 'academic_professional' && f.status !== 'safe').length,
    },
    location_routine: {
      category: 'location_routine',
      label: 'Location & Routine',
      score: Math.min(100, Math.round((categoryRawScores.location_routine.current / categoryRawScores.location_routine.max) * 100)),
      maxScore: 100,
      weight: 0.20,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.location_routine.current / categoryRawScores.location_routine.max) * 100))),
      description: 'Real-time travel announcements, predictable routines, and neighborhood check-ins.',
      findingsCount: factors.filter(f => f.category === 'location_routine' && f.status !== 'safe').length,
    },
    contact_details: {
      category: 'contact_details',
      label: 'Contact Information',
      score: Math.min(100, Math.round((categoryRawScores.contact_details.current / categoryRawScores.contact_details.max) * 100)),
      maxScore: 100,
      weight: 0.15,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.contact_details.current / categoryRawScores.contact_details.max) * 100))),
      description: 'Publicly exposed personal emails, phone numbers, and direct messaging addresses.',
      findingsCount: factors.filter(f => f.category === 'contact_details' && f.status !== 'safe').length,
    },
    account_security: {
      category: 'account_security',
      label: 'Account Security',
      score: Math.min(100, Math.round((categoryRawScores.account_security.current / categoryRawScores.account_security.max) * 100)),
      maxScore: 100,
      weight: 0.20,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.account_security.current / categoryRawScores.account_security.max) * 100))),
      description: 'Password hygiene, MFA enforcement, privacy settings audits, and message vigilance.',
      findingsCount: factors.filter(f => f.category === 'account_security' && f.status !== 'safe').length,
    },
    oversharing_habits: {
      category: 'oversharing_habits',
      label: 'Oversharing & Footprint',
      score: Math.min(100, Math.round((categoryRawScores.oversharing_habits.current / categoryRawScores.oversharing_habits.max) * 100)),
      maxScore: 100,
      weight: 0.10,
      level: getRiskLevel(Math.min(100, Math.round((categoryRawScores.oversharing_habits.current / categoryRawScores.oversharing_habits.max) * 100))),
      description: 'Unredacted document photos, screenshots, handle reuse, and tagging networks.',
      findingsCount: factors.filter(f => f.category === 'oversharing_habits' && f.status !== 'safe').length,
    },
  };

  // Weighted Total Score Calculation (0 - 100)
  const weightedScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        categoryScores.identity.score * 0.20 +
        categoryScores.academic_professional.score * 0.15 +
        categoryScores.location_routine.score * 0.20 +
        categoryScores.contact_details.score * 0.15 +
        categoryScores.account_security.score * 0.20 +
        categoryScores.oversharing_habits.score * 0.10
      )
    )
  );

  const overallRiskLevel = getRiskLevel(weightedScore);
  const totalIndicators = factors.filter((f) => f.status !== 'safe').length;

  // High priority risks
  const highPriorityRisks: AssessmentRecord['highPriorityRisks'] = [];
  factors
    .filter((f) => f.status === 'danger')
    .forEach((f) => {
      highPriorityRisks.push({
        id: f.id,
        title: f.label,
        severity: f.riskPoints >= 10 ? 'critical' : 'high',
        category: categoryScores[f.category].label,
        detail: f.explanation,
      });
    });

  // Action Plan Generation
  const actionPlan: ActionPlanItem[] = [];
  let planId = 1;

  if (inputs.mfaEnabled !== 'all_accounts') {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Enforce Multi-Factor Authentication Across All Primary Accounts',
      priority: 'critical',
      category: 'account_security',
      action: 'Set up an authenticator app (TOTP) or hardware security key for your email, student/work portal, and cloud storage.',
      impact: 'Blocks up to 99% of automated credential stuffing and password-based account takeovers.',
      completed: false,
    });
  }

  if (inputs.reusesPasswords !== 'never') {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Eliminate Password Reuse with a Password Manager',
      priority: 'critical',
      category: 'account_security',
      action: 'Migrate to Bitwarden, 1Password, or Proton Pass; generate unique 16+ character passwords for every service.',
      impact: 'Isolates the blast radius of any third-party breach from your primary identity.',
      completed: false,
    });
  }

  if (inputs.postsTravelRealtime) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Halt Real-Time Travel and Departure Broadcasting',
      priority: 'high',
      category: 'location_routine',
      action: 'Delay vacation and airport photos until you have returned home. Ensure location geotagging is off.',
      impact: 'Eliminates out-of-town pretexting scams targeting your family and protects against physical burglary.',
      completed: false,
    });
  }

  if (inputs.sharesCertsOrIDs) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Redact Document IDs from Social Media Posts',
      priority: 'high',
      category: 'oversharing_habits',
      action: 'Edit or remove past photos of certificates, student IDs, or event passes. Redact barcodes, registration numbers, and signatures.',
      impact: 'Prevents identity impersonators from harvesting authentic credential identifiers to bypass verification checks.',
      completed: false,
    });
  }

  if (inputs.profileVisibility === 'public') {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Restrict Public Profile Visibility & Audit Search Indexing',
      priority: 'high',
      category: 'identity',
      action: 'Change personal social profiles to private. For professional networks like LinkedIn, toggle off public visibility of contact details and connection lists.',
      impact: 'Denies automated OSINT scrapers and social engineering reconnaissance tools access to your personal network.',
      completed: false,
    });
  }

  if (inputs.revealsContactInfo) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Mask or Remove Direct Personal Phone & Email from Public Bios',
      priority: 'medium',
      category: 'contact_details',
      action: 'Replace direct phone/email on public profiles with masked email aliases (e.g. SimpleLogin or Hide My Email) or in-platform contact forms.',
      impact: 'Drastically reduces unsolicited smishing (SMS phishing) and targeted phishing calls.',
      completed: false,
    });
  }

  if (inputs.revealsBirthdateMilestones) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Conceal Birth Year and Exact Date from Public View',
      priority: 'medium',
      category: 'identity',
      action: 'Configure social media accounts to show only day and month to close friends, or hide birthday notifications completely.',
      impact: 'Removes a core data point used by fraudsters to answer identity verification questions.',
      completed: false,
    });
  }

  if (inputs.reusesUsernames) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Decouple Usernames Between Sensitive and Public Profiles',
      priority: 'low',
      category: 'oversharing_habits',
      action: 'Use randomized or varied handles for hobby forums and gaming accounts rather than mirroring your professional name.',
      impact: 'Prevents adversaries from connecting casual online discourse to your real-world identity.',
      completed: false,
    });
  }

  // Baseline good hygiene action if score is very low
  if (actionPlan.length === 0) {
    actionPlan.push({
      id: `act_${planId++}`,
      title: 'Schedule a Quarterly Privacy & Connected App Audit',
      priority: 'low',
      category: 'account_security',
      action: 'Review authorized third-party OAuth apps in Google/Apple/GitHub settings and revoke inactive permissions.',
      impact: 'Maintains pristine cyber hygiene and prevents stale API tokens from leaking personal data.',
      completed: false,
    });
  }

  return {
    profileName: inputs.profileName || 'Anonymous User',
    isSample: Boolean(options?.isSample),
    sampleType: options?.sampleType,
    inputs,
    overallScore: weightedScore,
    riskLevel: overallRiskLevel,
    totalIndicators,
    categoryScores,
    scoredFactors: factors,
    highPriorityRisks,
    actionPlan,
  };
}

export function buildDeterministicAiFallback(
  inputs: ProfileAssessmentInput,
  categoryScores: Record<CategoryKey, CategoryScoreDetail>
): AiPrivacyAnalysis {
  const exposureFindings: AiPrivacyAnalysis['exposureFindings'] = [];
  const socialEngineeringRisks: AiPrivacyAnalysis['socialEngineeringRisks'] = [];
  const priorityActions: string[] = [];

  if (inputs.revealsInstitution) {
    exposureFindings.push({
      category: 'Academic & Professional Exposure',
      severity: 'high',
      evidence: inputs.institutionName ? `Affiliation with ${inputs.institutionName} indicated` : 'Public academic or employer affiliation visible',
      explanation: 'Attackers target college students and corporate staff using authoritative pretexting such as urgent financial aid updates or IT maintenance warnings.',
      recommendation: 'Verify official communications through bookmarked internal portals rather than clicking unsolicited message links.',
    });
    socialEngineeringRisks.push({
      attackType: 'Targeted Spear Phishing (Academic / Employer Pretexting)',
      explanation: 'An attacker impersonates your dean, department head, or HR recruiter citing specific organizational events to harvest portal credentials.',
      defensiveAction: 'Always inspect the actual sender email domain and verify unexpected urgent requests out-of-band.',
    });
    priorityActions.push('Confirm unexpected departmental or recruiter communications through verified direct contacts');
  }

  if (inputs.postsTravelRealtime) {
    exposureFindings.push({
      category: 'Location & Physical Routine',
      severity: 'high',
      evidence: 'Real-time travel updates and airport/destination posts',
      explanation: 'Broadcasting live travel status confirms your physical absence from home and provides precise temporal windows for urgent scams.',
      recommendation: 'Adopt a delayed posting policy; share vacation memories only after returning.',
    });
    socialEngineeringRisks.push({
      attackType: 'Emergency Pretexting & Relative Impersonation',
      explanation: 'Fraudsters contact family members claiming you suffered an emergency at the airport or hotel, demanding immediate funds before you can be reached.',
      defensiveAction: 'Establish an offline family passphrase or code word for verifying genuine emergency situations.',
    });
    priorityActions.push('Switch travel photo sharing to post-trip retrospectives');
  }

  if (inputs.revealsContactInfo) {
    exposureFindings.push({
      category: 'Contact Details Exposure',
      severity: 'medium',
      evidence: `Publicly accessible channels: ${inputs.contactDetailsVisible.join(', ') || 'Email/phone'}`,
      explanation: 'Direct phone numbers and personal emails are correlated with data broker leaks to deliver personalized vishing and smishing.',
      recommendation: 'Use private email aliases and do not publish personal mobile numbers on public bio sections.',
    });
    socialEngineeringRisks.push({
      attackType: 'Voice Phishing (Vishing) & SMS Smishing',
      explanation: 'Attackers spoof legitimate institutions with urgent SMS security alerts or phone calls requesting one-time verification codes.',
      defensiveAction: 'Never provide one-time passwords (OTPs) or two-factor prompts over an incoming telephone call.',
    });
  }

  if (inputs.sharesCertsOrIDs) {
    exposureFindings.push({
      category: 'Credential & Documentation Exposure',
      severity: 'high',
      evidence: 'Unredacted certificates, badges, or identification images shared publicly',
      explanation: 'Document numbers, issue dates, and barcode metadata allow bad actors to forge secondary credentials or answer identity verification challenges.',
      recommendation: 'Mask all registration numbers, barcode graphics, and student identifiers before sharing achievements.',
    });
    socialEngineeringRisks.push({
      attackType: 'Identity Corroboration & Impersonation',
      explanation: 'Scammers quote legitimate certificate numbers in fraudulent applications to establish credibility with third parties.',
      defensiveAction: 'Audit social archives to remove or obscure unredacted official certificates and identity documents.',
    });
    priorityActions.push('Redact all visible document numbers from public achievement photos');
  }

  if (inputs.reusesPasswords !== 'never') {
    socialEngineeringRisks.push({
      attackType: 'Credential Stuffing Cascade',
      explanation: 'Credentials leaked from minor breached services are tested against your high-value academic and banking portals.',
      defensiveAction: 'Enforce unique passwords with a password manager and enable multi-factor authentication everywhere.',
    });
    priorityActions.push('Deploy a dedicated password manager and replace reused passwords');
  }

  if (priorityActions.length === 0) {
    priorityActions.push('Maintain regular quarterly privacy audits of linked social accounts');
  }

  return {
    available: true,
    engineUsed: 'deterministic-fallback',
    summary: 'Deterministic Privacy Analysis completed using rule-based behavioral heuristics. This assessment highlights specific publicly accessible indicators and models how social engineers exploit interconnected data points.',
    exposureFindings,
    socialEngineeringRisks,
    priorityActions,
    limitations: [
      'This educational assessment evaluates self-reported exposure indicators, not direct database access.',
      'A low risk score indicates strong hygiene boundaries but does not guarantee immunity from zero-day threats or third-party service breaches.',
      'Attack scenarios are simulated educational models designed to cultivate situational awareness.',
    ],
  };
}

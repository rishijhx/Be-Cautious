import { SimulatorScenario } from '../types';

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'recruiter_internship_spearphish',
    title: 'The "Fast-Track" Dream Internship Offer',
    targetRole: 'College Student seeking summer internship',
    publicDataInvolved: [
      'University name (State Tech)',
      'Department / Major (Computer Science Junior)',
      'Upcoming conference attendance (#CyberSecSummit26 in Austin)',
      'Publicly shared certification ID (#CSA-98214-STU)',
      'Public student email & Discord handle',
    ],
    psychologicalTactic: 'Flattery, Scarcity & Fear of Missing Out (FOMO)',
    tacticExplanation: 'Attackers target ambitious students under pressure to secure competitive summer internships. By referencing specific certifications and conference plans, the fraudster creates instant authority and lowers the victim’s natural suspicion.',
    believabilityFactor: 'The message mentions the student’s actual department head, quotes their exact exam certificate number, and refers to the conference they publicly posted about attending.',
    simulatedMessage: {
      sender: 'Dr. Marcus Vance <m.vance@talentscout-cyberpartner.com>',
      channel: 'LinkedIn',
      subject: 'Fast-Track Summer 2026 Security Analyst Internship — State Tech CS Partnership',
      body: `Hi Maya,

I noticed your recent achievement passing the Cloud Security Associate exam (#CSA-98214-STU)—congratulations! Several State Tech alumni on our executive board recommended your work.

We have 2 remaining paid positions ($52/hr + housing stipend) for our Cyber Threat Intelligence rotation. Since you will already be in Austin next week for the CyberSec Summit, our Senior Director would love to conduct an expedited on-site briefing with you.

Because hiring decisions close this Friday at 5:00 PM, please complete your applicant background questionnaire and pre-interview portal registration before 6:00 PM today:

👉 https://talentscout-cyberpartner.com/state-tech/applicant-portal/auth-login?id=98214

Please log in using your university SSO credentials so your academic transcript imports automatically. Looking forward to meeting you in Austin!

Best regards,
Dr. Marcus Vance
Senior Talent Acquisition Partner · CyberDefense Alliance`,
      redFlags: [
        {
          phrase: 'talentscout-cyberpartner.com',
          reason: 'Lookalike domain: Notice it is not an official company domain or verified campus job portal (Handshake).',
        },
        {
          phrase: '2 remaining paid positions ... close this Friday at 5:00 PM',
          reason: 'Artificial Urgency: Forcing the victim to act impulsively before independently verifying the opportunity.',
        },
        {
          phrase: 'log in using your university SSO credentials',
          reason: 'Credential Harvesting: Legitimate third-party recruiters NEVER ask you to input university SSO passwords on external websites.',
        },
        {
          phrase: '#CSA-98214-STU',
          reason: 'Exploitation of Public OSINT: The attacker scraped this certificate number directly from the student’s unredacted LinkedIn photo.',
        },
      ],
    },
    warningSigns: [
      'High-pressure deadline demanding action within hours to avoid losing a lucrative opportunity.',
      'Request to input university single sign-on (SSO) credentials on an unverified external domain.',
      'Sender domain does not match any recognized corporate partner or campus recruiting registry.',
      'Flattery regarding accomplishments paired with immediate bypassing of standard application pipelines.',
    ],
    defensiveVerification: [
      'Contact your university career center or department advisor to check if "CyberDefense Alliance" is an approved campus partner.',
      'Search the purported recruiter on the official company website or corporate directory rather than relying on their message link.',
      'Never input institutional credentials on any site other than your institution’s verified login URL.',
      'Search LinkedIn directly to confirm the recruiter’s profile tenure, endorsements, and corporate email domain.',
    ],
  },
  {
    id: 'it_helpdesk_migration',
    title: 'Urgent IT Helpdesk System Migration Notice',
    targetRole: 'Corporate Professional / Remote Employee',
    publicDataInvolved: [
      'Company name (Apex Financial Systems)',
      'Division (Enterprise Payments)',
      'Tech stack details mentioned in posts (merchant settlement gateway)',
      'Corporate email address & direct mobile number',
    ],
    psychologicalTactic: 'Authority, Institutional Coercion & Panic',
    tacticExplanation: 'Attackers disguise themselves as internal IT or security administrators. Threatening immediate account suspension or loss of work files triggers panic, bypassing analytical skepticism.',
    believabilityFactor: 'The message references the specific division ("Enterprise Payments") and upcoming deployment date discovered from the employee’s public LinkedIn announcement.',
    simulatedMessage: {
      sender: 'Apex IT Global Helpdesk <security-alerts@apexfinancial-support-portal.net>',
      channel: 'Email',
      subject: 'ACTION REQUIRED: [Urgent] Mandatory Multi-Factor Reset for Enterprise Payments Staff',
      body: `ATTENTION DAVID VANCE,

During our scheduled Q3 merchant settlement infrastructure audit last night, our automated security sensors detected abnormal sync requests originating from your corporate workstation.

In compliance with ISO-27001 policy, your corporate email, Jira access, and AWS gateway tokens are scheduled for automatic quarantine in 45 minutes unless authentication credentials are confirmed:

Action Required:
1. Navigate immediately to the IT self-service gateway:
   https://apexfinancial-support-portal.net/auth/mfa-sync?user=david.vance
2. Enter your current domain password and confirm the 6-digit authenticator prompt.

Failure to verify prior to 12:00 PM EDT will require a physical trip to headquarters with photo ID to restore system access.

Global Information Security Operations Center
Apex Financial Systems Inc.`,
      redFlags: [
        {
          phrase: 'apexfinancial-support-portal.net',
          reason: 'Typosquatting / Lookalike domain: Legitimate company domain is apexfinancial.io, not apexfinancial-support-portal.net.',
        },
        {
          phrase: 'automatic quarantine in 45 minutes',
          reason: 'Manufactured Panic: Imposing severe consequences with an extremely short countdown clock.',
        },
        {
          phrase: 'Enter your current domain password and confirm the 6-digit authenticator prompt',
          reason: 'MFA Interception: Attacker sets up a reverse proxy to steal the live 2FA code in real time while logging in on the real site.',
        },
        {
          phrase: 'Enterprise Payments Staff',
          reason: 'Targeted Pretexting: Leveraged David’s public LinkedIn title and division info to sound authoritative.',
        },
      ],
    },
    warningSigns: [
      'Short countdown (45 minutes) threatening severe work disruption.',
      'External sender address masquerading as internal corporate IT.',
      'Direct instruction to provide both a password and live MFA code on a web link.',
      'Generic corporate sign-off without a reachable internal extension or Slack handle.',
    ],
    defensiveVerification: [
      'Reach out directly to your internal IT team via your company Slack, Teams, or official intranet ticketing system.',
      'Check your company internal security announcements board to confirm if any mandatory migrations are active.',
      'Examine the sender’s full email header; look for external mail warning banners.',
      'Never approve an MFA prompt or enter a TOTP code on an external link prompted by an urgent email.',
    ],
  },
  {
    id: 'travel_airport_pretext',
    title: 'The Real-Time Travel "Airport Emergency" Scam',
    targetRole: 'Executive / Family Member of Traveling Executive',
    publicDataInvolved: [
      'Real-time flight boarding selfie (Flight UA 442 to Zurich)',
      'Dates of international stay',
      'Tagged family members and close colleagues',
      'Public mobile phone number in profile bio',
    ],
    psychologicalTactic: 'Information Asymmetry & Emotional Urgency',
    tacticExplanation: 'When an executive boards an international long-haul flight, they are unreachable for 8 to 12 hours. Scammers exploit this exact communication blackout to target colleagues or family with urgent financial requests.',
    believabilityFactor: 'The scammer knows David is literally in the air right now on Flight UA 442 and cannot answer calls to dispute the situation.',
    simulatedMessage: {
      sender: '+1 (555) 019-4829 (Spoofed or burner SMS)',
      channel: 'SMS',
      subject: 'URGENT MESSAGE FROM DAVID VANCE EN ROUTE',
      body: `Hey Sarah, David here from the Zurich airport transit desk.

Our connection was rerouted through Frankfurt due to an equipment malfunction, and my corporate cards were flagged for fraud protection during the transit check. I cannot access international roaming until we clear Swiss customs tonight.

Can you process an expedited invoice release ($8,400) for the Swiss hosting venue deposit right now so our keynote room isn't released? Use the secondary vendor wire wire-link below, I've already cleared it with Finance verbally before takeoff:

https://quickpay-apex-transit.com/wire-authorization?batch=ZH442

Please confirm once transmitted. Boarding final leg now!`,
      redFlags: [
        {
          phrase: 'Zurich airport transit desk ... rerouted through Frankfurt',
          reason: 'Exploiting Flight Status: Scammer timed the message precisely during David’s flight window when his phone is offline.',
        },
        {
          phrase: 'corporate cards were flagged ... cannot access international roaming',
          reason: 'Pretexting Isolation: Pre-explaining why David cannot be reached directly by phone or video call.',
        },
        {
          phrase: 'quickpay-apex-transit.com',
          reason: 'Fraudulent Payment Gateway: Unregistered third-party domain masquerading as an internal finance tool.',
        },
        {
          phrase: 'batch=ZH442',
          reason: 'Leveraging Public Post Details: Scammer used the flight number (UA 442) from David’s public boarding selfie.',
        },
      ],
    },
    warningSigns: [
      'Request to bypass standard accounting protocols and dual-authorization procedures.',
      'Message sent from an unfamiliar phone number with an elaborate explanation of why normal channels are down.',
      'Timed deliberately when the purported sender is known to be in-flight or unreachable.',
      'Pressure to release financial wires without formal vendor verification.',
    ],
    defensiveVerification: [
      'Enforce strict company policy: No financial disbursements or wire adjustments can be authorized via SMS.',
      'Call David’s designated emergency second-in-command or traveling assistant via known corporate channels.',
      'Verify the vendor invoice in the official ERP / Accounts Payable system.',
      'Establish personal verification passwords with family members before international travel.',
    ],
  },
  {
    id: 'cert_credential_harvest',
    title: 'Licensing Board Regulatory Verification Notice',
    targetRole: 'Certified Professional / License Holder',
    publicDataInvolved: [
      'Unredacted photo of state license or certification diploma',
      'Visible license registration number & issue date',
      'Full legal name and issuing authority',
      'Public LinkedIn profile',
    ],
    psychologicalTactic: 'Regulatory Compliance Fear & Institutional Deception',
    tacticExplanation: 'Attackers use authentic license numbers harvested from social media to impersonate regulatory boards, claiming that an urgent audit or re-certification fee is required.',
    believabilityFactor: 'The message cites the victim’s exact license serial number, state issuing board, and graduation year with 100% accuracy.',
    simulatedMessage: {
      sender: 'State Licensing Verification Board <audit@state-licensing-verification.org>',
      channel: 'Email',
      subject: 'MANDATORY AUDIT: License #CSA-98214-STU Compliance Notice',
      body: `Dear License Holder,

A periodic audit of the State Cyber & Cloud Security registry has identified missing continuing professional education (CPE) attestations for License #CSA-98214-STU.

Pursuant to Section 14-B of the Administrative Code, unverified credentials will be transitioned to "Suspended / Inactive" status on the public registry within 72 hours.

To avoid suspension and retain active standing:
1. Access the compliance portal: https://state-licensing-verification.org/audit?id=CSA-98214-STU
2. Provide your date of birth, SSN last-4, and upload a government-issued photo ID to confirm identity.
3. Remit the $35 administrative processing fee.

State Board of Professional Certification`,
      redFlags: [
        {
          phrase: 'state-licensing-verification.org',
          reason: 'Fake Regulatory Entity: Non-governmental .org domain imitating an official state board.',
        },
        {
          phrase: 'License #CSA-98214-STU',
          reason: 'Harvested Credential Data: Scraped from an unredacted certificate photo posted online.',
        },
        {
          phrase: 'date of birth, SSN last-4, and upload a government-issued photo ID',
          reason: 'High-Value Identity Theft: The scammer aims to collect enough PII to open fraudulent credit lines or bypass bank KYC.',
        },
        {
          phrase: 'transitioned to "Suspended / Inactive" status within 72 hours',
          reason: 'Regulatory Threat: Inducing fear of professional embarrassment or loss of employment.',
        },
      ],
    },
    warningSigns: [
      'Demand for highly sensitive PII (SSN, government ID photo) over an unverified web form.',
      'Threat of professional license suspension with arbitrary deadlines.',
      'Domain ending in .org or .com rather than official .gov or accredited board portal.',
      'Requirement to pay administrative fees via unusual third-party payment links.',
    ],
    defensiveVerification: [
      'Look up the official state licensing board website directly using a search engine, never using links in the email.',
      'Log into your official member portal directly through the bookmarked government website.',
      'Call the board’s publicly published office number to check if any compliance notices exist.',
      'Remove past social posts showing unredacted licenses or certificates.',
    ],
  },
];

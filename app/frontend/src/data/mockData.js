export const MOCK_PERSONAS = [
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'sarah.jenkins@acmecorp.com',
    avatar: '👩‍💻',
    initials: 'SJ',
    balances: {
      casualLeave: { used: 4, total: 12 },
      sickLeave: { used: 1, total: 10 },
      earnedLeave: { used: 6, total: 15 },
      homeOfficeClaimed: 350,
      homeOfficeLimit: 500,
      securityScore: 100
    }
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'HR Director',
    department: 'People Operations',
    email: 'marcus.vance@acmecorp.com',
    avatar: '👨‍💼',
    initials: 'MV',
    balances: {
      casualLeave: { used: 2, total: 12 },
      sickLeave: { used: 0, total: 10 },
      earnedLeave: { used: 8, total: 15 },
      homeOfficeClaimed: 500,
      homeOfficeLimit: 500,
      securityScore: 98
    }
  },
  {
    id: 'david',
    name: 'David Chen',
    role: 'InfoSec & Compliance Lead',
    department: 'Security',
    email: 'david.chen@acmecorp.com',
    avatar: '🛡️',
    initials: 'DC',
    balances: {
      casualLeave: { used: 3, total: 12 },
      sickLeave: { used: 2, total: 10 },
      earnedLeave: { used: 5, total: 15 },
      homeOfficeClaimed: 220,
      homeOfficeLimit: 500,
      securityScore: 100
    }
  }
];

export const MOCK_DOCUMENTS = [
  {
    id: 'doc-leave-2024',
    title: 'Employee Leave & Attendance Policy (2024)',
    filename: 'HR_Leave_Policy_2024.md',
    category: 'HR & Benefits',
    version: 'v2.4',
    lastUpdated: 'Jan 15, 2024',
    pages: 4,
    author: 'People Operations',
    description: 'Comprehensive guidelines covering Casual Leave, Sick Leave, Earned Leave, Maternity/Paternity Leave, and approval workflows.',
    tags: ['Leave', 'Holidays', 'Maternity', 'Comp-off'],
    content: `# ACME Corp - Employee Leave & Attendance Policy (2024)

## Section 1: Overview & Scope
This policy applies to all full-time and contract employees of ACME Corp. The purpose of this policy is to establish clear guidelines regarding leave entitlements, approval workflows, and attendance expectations.

---

## Section 2: Types of Leave

### 2.1 Casual Leave (CL)
- **Entitlement**: 12 days per calendar year (accrued at 1 day per month worked).
- **Purpose**: For urgent personal matters or short unplanned absences.
- **Maximum Consecutive Days**: Cannot be taken for more than 3 consecutive working days without prior Manager approval.
- **Carry-over**: Unused Casual Leave lapses at the end of each calendar year (December 31st) and cannot be encashed or carried forward.

### 2.2 Sick Leave (SL)
- **Entitlement**: 10 days per calendar year.
- **Purpose**: Illness, medical appointments, or recovery.
- **Medical Certificate Requirement**: A registered medical practitioner's certificate is mandatory for any sick leave exceeding 2 consecutive working days.
- **Carry-over**: A maximum of 5 unused Sick Leave days can be carried forward to the next calendar year.

### 2.3 Earned / Privilege Leave (EL)
- **Entitlement**: 15 days per year, credited annually on January 1st after completing 6 months of continuous service.
- **Prior Notice**: Must be applied at least 14 days in advance via the HR portal.
- **Encashed Leave**: Up to 10 days of Earned Leave may be encashed at the time of financial year-end or separation.

### 2.4 Parental Leave
- **Maternity Leave**: Female employees are entitled to 26 weeks of fully paid maternity leave for up to two surviving children. Applications must be submitted 8 weeks prior to the expected date of delivery.
- **Paternity Leave**: Male employees are entitled to 2 weeks (10 business days) of fully paid paternity leave, which must be taken within 6 months of childbirth or legal adoption.

### 2.5 Bereavement Leave
- **Entitlement**: Up to 5 consecutive working days of paid leave in the unfortunate event of the demise of an immediate family member (spouse, child, parent, sibling).

---

## Section 3: Leave Application Workflow
1. All leave requests must be logged through the internal HR Portal.
2. Requests for planned leaves (EL) must be approved by the reporting manager at least 14 calendar days prior.
3. In case of unexpected absence (Sick/Casual), employees must inform their manager and HR via Slack or email by 9:30 AM local time.`
  },
  {
    id: 'doc-it-security-2024',
    title: 'IT Security & Remote Work Guidelines',
    filename: 'IT_Security_and_Remote_Work_Policy.md',
    category: 'IT & Security',
    version: 'v3.1',
    lastUpdated: 'Feb 02, 2024',
    pages: 3,
    author: 'Information Security',
    description: 'Rules governing company-issued hardware, home office allowance ($500 limit), password complexity, and data protection.',
    tags: ['Security', 'Remote Work', 'Allowance', 'Passwords'],
    content: `# ACME Corp - IT Security and Remote Work Policy (2024)

## Section 1: Purpose & Classification
This document governs company-issued hardware, secure remote access, data handling, and employee cybersecurity protocols.

---

## Section 2: Remote Work Guidelines
- **Core Working Hours**: All remote employees must be available on Slack and email during core business hours (10:00 AM – 4:00 PM in their respective time zones).
- **Home Office Allowance**: Full-time employees receive a one-time reimbursement of up to $500 for ergonomic desk equipment and monitor accessories.
- **Internet Speed Requirement**: A minimum stable broadband connection of 50 Mbps download and 10 Mbps upload is required.

---

## Section 3: Device Security & Access Control
- **Authorized Hardware**: Work must only be conducted on ACME-issued laptops configured with Mobile Device Management (MDM). Personal devices (BYOD) may only be used for Slack and Google Workspace with multi-factor authentication (MFA).
- **Password Complexity**:
  - Passwords must be at least 14 characters long.
  - Must include uppercase letters, lowercase letters, numbers, and at least one special character.
  - Passwords expire every 90 days.
  - Password reuse is prohibited for the last 6 iterations.
- **Multi-Factor Authentication (MFA)**: Mandatory for all enterprise tools via hardware security keys (YubiKey) or Okta Verify. SMS MFA is disallowed.

---

## Section 4: Data Protection & Confidentiality
- **Source Code and Customer Data**: Strictly forbidden from being copied to USB flash drives, personal cloud storage (Google Drive, Dropbox, iCloud), or unapproved AI platforms.
- **Approved AI Tools**: Only company-approved enterprise AI systems hosted on local networks or approved enterprise LLMs may process company data. Public ChatGPT/Claude access with company data is strictly prohibited.
- **Incident Reporting**: Lost or stolen laptops must be reported to security@acmecorp.com within 2 hours of discovery to initiate remote wipe.`
  },
  {
    id: 'doc-benefits-2024',
    title: 'Global Health & Wellness Benefits',
    filename: 'Employee_Benefits_and_Health_Coverage.md',
    category: 'HR & Benefits',
    version: 'v1.8',
    lastUpdated: 'Mar 10, 2024',
    pages: 5,
    author: 'People Operations',
    description: 'Comprehensive medical, dental, vision coverage, annual fitness stipends ($600/year), and Employee Assistance Program (EAP).',
    tags: ['Health', 'Insurance', 'Fitness', 'Mental Health'],
    content: `# ACME Corp - Global Health & Wellness Benefits Guide

## 1. Medical & Dental Insurance
All regular full-time employees and their eligible dependents are covered under ACME Comprehensive Health Care starting on Day 1 of employment.
- In-network preventive care is covered at 100%.
- Annual out-of-pocket maximum is $2,000 for individual and $4,000 for family.

## 2. Wellness & Fitness Stipend
Employees are eligible for a $50/month ($600/year) fitness reimbursement covering gym memberships, yoga classes, or fitness trackers. Claims must be submitted via the expenses portal with receipts.`
  },
  {
    id: 'doc-ethics-2024',
    title: 'Code of Conduct & Business Ethics',
    filename: 'Code_of_Business_Conduct_and_Ethics.md',
    category: 'Compliance',
    version: 'v4.0',
    lastUpdated: 'Jan 05, 2024',
    pages: 6,
    author: 'Legal & Compliance',
    description: 'Ethical behavior, anti-harassment policies, conflicts of interest, and anonymous whistleblower hotline procedures.',
    tags: ['Ethics', 'Legal', 'Whistleblower', 'Compliance'],
    content: `# ACME Corp - Code of Business Conduct & Ethics

## 1. Zero Tolerance for Harassment
ACME Corp is committed to maintaining a safe, inclusive workplace free from discrimination, bullying, or harassment of any kind.

## 2. Anonymous Whistleblower Hotline
Employees who observe unethical practices, financial irregularities, or policy violations can submit anonymous reports at ethics.acmecorp.internal or call 1-800-ACME-SAFE.`
  }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: '2024 Remote Work Policy Update',
    date: 'Feb 15, 2024',
    category: 'IT Security',
    snippet: 'Reminder: All remote employees must verify their broadband speed meets the 50 Mbps minimum mandate.',
    badge: 'Mandatory'
  },
  {
    id: 'ann-2',
    title: 'Public Holiday Calendar 2024',
    date: 'Jan 10, 2024',
    category: 'HR Operations',
    snippet: 'The official 10 paid public holidays for 2024 have been published to the HR portal.',
    badge: 'Information'
  },
  {
    id: 'ann-3',
    title: 'Annual Sick Leave Carry-Forward Limit',
    date: 'Jan 02, 2024',
    category: 'HR Operations',
    snippet: 'A maximum of 5 unused sick days from 2023 have been carried over to your 2024 balance.',
    badge: 'Action'
  }
];

export const SAMPLE_KB = [
  {
    keywords: ['casual leave', 'cl', 'days of casual', 'carry over casual'],
    answer: `According to the **HR Leave Policy 2024 (Section 2.1)**:\n\n- **Entitlement**: You receive **12 days of Casual Leave (CL)** per calendar year, accrued at 1 day per month worked.\n- **Consecutive limit**: You cannot take more than 3 consecutive working days without prior Manager approval.\n- **Carry-over rule**: Unused Casual Leave **lapses at the end of each calendar year** (December 31st) and **cannot be encashed or carried forward**.`,
    citations: [
      {
        sourceFile: 'HR_Leave_Policy_2024.md',
        pageNumber: 1,
        section: 'Section 2.1 Casual Leave',
        excerpt: '- Entitlement: 12 days per calendar year (accrued at 1 day per month worked). Unused Casual Leave lapses at the end of each calendar year.'
      }
    ]
  },
  {
    keywords: ['sick leave', 'sl', 'doctor note', 'medical certificate', 'carry over sick'],
    answer: `Based on the **HR Leave Policy 2024 (Section 2.2)**:\n\n- **Entitlement**: **10 days of Sick Leave** per calendar year.\n- **Medical Certificate**: A registered medical doctor's note is **mandatory for any absence exceeding 2 consecutive working days**.\n- **Carry-forward**: You can carry forward a **maximum of 5 unused Sick Leave days** into the following calendar year.`,
    citations: [
      {
        sourceFile: 'HR_Leave_Policy_2024.md',
        pageNumber: 2,
        section: 'Section 2.2 Sick Leave',
        excerpt: 'Medical Certificate Requirement: A registered medical practitioner\'s certificate is mandatory for any sick leave exceeding 2 consecutive working days. A maximum of 5 unused Sick Leave days can be carried forward.'
      }
    ]
  },
  {
    keywords: ['home office', 'allowance', 'reimbursement', 'desk', 'monitor', '$500'],
    answer: `According to the **IT Security & Remote Work Policy (Section 2)**:\n\n- **Home Office Allowance**: Full-time employees are eligible for a **one-time reimbursement of up to $500** for ergonomic desk equipment and monitor accessories.\n- **Reimbursement Process**: Submit receipts via the expense portal within 90 days of purchase.`,
    citations: [
      {
        sourceFile: 'IT_Security_and_Remote_Work_Policy.md',
        pageNumber: 1,
        section: 'Section 2 Remote Work Guidelines',
        excerpt: 'Home Office Allowance: Full-time employees receive a one-time reimbursement of up to $500 for ergonomic desk equipment and monitor accessories.'
      }
    ]
  },
  {
    keywords: ['password', 'complexity', 'expire', 'characters', 'security'],
    answer: `Under the **IT Security Policy (Section 3)**, corporate password requirements are:\n\n1. Minimum length of **14 characters**.\n2. Must contain uppercase letters, lowercase letters, numbers, and at least one special character.\n3. Passwords **expire every 90 days**.\n4. You cannot reuse any of your last 6 passwords.`,
    citations: [
      {
        sourceFile: 'IT_Security_and_Remote_Work_Policy.md',
        pageNumber: 2,
        section: 'Section 3 Device Security & Access Control',
        excerpt: 'Passwords must be at least 14 characters long. Passwords expire every 90 days. Password reuse is prohibited for the last 6 iterations.'
      }
    ]
  },
  {
    keywords: ['maternity', 'paternity', 'parental', 'baby', 'child'],
    answer: `As stated in the **HR Leave Policy 2024 (Section 2.4)**:\n\n- **Maternity Leave**: **26 weeks of fully paid leave** for female employees (for up to two surviving children). Notice must be given 8 weeks prior.\n- **Paternity Leave**: **2 weeks (10 business days) of fully paid leave** for male employees, usable within 6 months of childbirth or legal adoption.`,
    citations: [
      {
        sourceFile: 'HR_Leave_Policy_2024.md',
        pageNumber: 2,
        section: 'Section 2.4 Parental Leave',
        excerpt: 'Maternity Leave: Female employees are entitled to 26 weeks of fully paid maternity leave. Paternity Leave: Male employees are entitled to 2 weeks (10 business days) of fully paid paternity leave.'
      }
    ]
  },
  {
    keywords: ['ai', 'chatgpt', 'claude', 'unapproved'],
    answer: `According to the **IT Security Policy (Section 4 - Data Protection)**:\n\n- Company source code and customer data are **strictly forbidden** from being submitted to public AI tools (such as public ChatGPT or Claude).\n- Only **company-approved enterprise AI systems hosted on local networks** (such as our internal PolicyHub running on local Ollama) are approved for corporate data.`,
    citations: [
      {
        sourceFile: 'IT_Security_and_Remote_Work_Policy.md',
        pageNumber: 3,
        section: 'Section 4 Data Protection & Confidentiality',
        excerpt: 'Only company-approved enterprise AI systems hosted on local networks or approved enterprise LLMs may process company data. Public ChatGPT/Claude access with company data is strictly prohibited.'
      }
    ]
  }
];

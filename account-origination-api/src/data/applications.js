const seedApplications = [
  {
    id: 'app_demo_1001',
    status: 'submitted',
    productCode: 'NORTHSTAR_CHECKING',
    channel: 'partner',
    applicant: {
      firstName: 'Jordan',
      lastName: 'Lee',
      email: 'jordan.lee@example.com',
      phone: '+1-555-0101',
      dateOfBirth: '1990-04-18',
      ssnLast4: '1234',
      address: {
        line1: '1200 Market Street',
        city: 'Denver',
        state: 'CO',
        postalCode: '80202',
        country: 'US'
      }
    },
    employment: {
      employmentStatus: 'employed',
      annualIncome: 92000
    },
    funding: {
      initialDepositAmount: 250,
      fundingSource: 'external_ach'
    },
    consents: {
      privacyPolicyAccepted: true,
      eSignAccepted: true
    },
    requestedDebitCard: true,
    partnerReferenceId: 'partner-demo-1001',
    riskTier: 'low',
    decisionReason: null,
    submittedAt: '2026-05-01T14:35:00.000Z',
    createdAt: '2026-05-01T14:35:00.000Z',
    updatedAt: '2026-05-01T14:35:00.000Z'
  },
  {
    id: 'app_demo_1002',
    status: 'in_review',
    productCode: 'NORTHSTAR_SAVINGS',
    channel: 'mobile',
    applicant: {
      firstName: 'Maya',
      lastName: 'Patel',
      email: 'maya.patel@example.com',
      phone: '+1-555-0102',
      dateOfBirth: '1986-09-03',
      ssnLast4: '5678',
      address: {
        line1: '455 Lakeview Avenue',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US'
      }
    },
    employment: {
      employmentStatus: 'self_employed',
      annualIncome: 136000
    },
    funding: {
      initialDepositAmount: 1000,
      fundingSource: 'debit_card'
    },
    consents: {
      privacyPolicyAccepted: true,
      eSignAccepted: true
    },
    requestedDebitCard: false,
    partnerReferenceId: 'mobile-demo-1002',
    riskTier: 'low',
    decisionReason: 'Manual review requested for self-employed income verification.',
    submittedAt: '2026-05-02T16:20:00.000Z',
    createdAt: '2026-05-02T16:20:00.000Z',
    updatedAt: '2026-05-03T09:10:00.000Z'
  },
  {
    id: 'app_demo_1003',
    status: 'approved',
    productCode: 'NORTHSTAR_PREMIER',
    channel: 'branch',
    applicant: {
      firstName: 'Avery',
      lastName: 'Morgan',
      email: 'avery.morgan@example.com',
      phone: '+1-555-0103',
      dateOfBirth: '1978-12-11',
      ssnLast4: '9012',
      address: {
        line1: '88 Harbor Drive',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'US'
      }
    },
    employment: {
      employmentStatus: 'employed',
      annualIncome: 210000
    },
    funding: {
      initialDepositAmount: 5000,
      fundingSource: 'wire'
    },
    consents: {
      privacyPolicyAccepted: true,
      eSignAccepted: true
    },
    requestedDebitCard: true,
    partnerReferenceId: 'branch-demo-1003',
    riskTier: 'low',
    decisionReason: 'Approved after identity and funding validation.',
    submittedAt: '2026-05-04T12:05:00.000Z',
    createdAt: '2026-05-04T12:05:00.000Z',
    updatedAt: '2026-05-04T12:45:00.000Z'
  }
];

const applications = seedApplications.map((application) =>
  JSON.parse(JSON.stringify(application))
);

module.exports = {
  applications
};

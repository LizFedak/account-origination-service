const crypto = require('crypto');

const allowedProductCodes = new Set([
  'NORTHSTAR_CHECKING',
  'NORTHSTAR_SAVINGS',
  'NORTHSTAR_PREMIER'
]);

const allowedChannels = new Set(['web', 'mobile', 'branch', 'partner']);

const allowedStatuses = new Set([
  'submitted',
  'in_review',
  'approved',
  'declined',
  'cancelled'
]);

const allowedTransitions = {
  submitted: new Set(['in_review', 'approved', 'cancelled']),
  in_review: new Set(['approved', 'declined', 'cancelled']),
  approved: new Set([]),
  declined: new Set([]),
  cancelled: new Set([])
};

function createApplicationId() {
  return `app_demo_${crypto.randomUUID().slice(0, 8)}`;
}

function getRequiredApplicantFields(applicant) {
  const missing = [];

  ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'ssnLast4'].forEach((field) => {
    if (!applicant || applicant[field] === undefined || applicant[field] === '') {
      missing.push(`applicant.${field}`);
    }
  });

  ['line1', 'city', 'state', 'postalCode', 'country'].forEach((field) => {
    if (!applicant || !applicant.address || applicant.address[field] === undefined || applicant.address[field] === '') {
      missing.push(`applicant.address.${field}`);
    }
  });

  return missing;
}

function validateCreateApplication(body) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request body must be a JSON object.'];
  }

  if (!body.productCode) {
    errors.push('productCode is required.');
  } else if (!allowedProductCodes.has(body.productCode)) {
    errors.push('productCode must be one of NORTHSTAR_CHECKING, NORTHSTAR_SAVINGS, NORTHSTAR_PREMIER.');
  }

  if (body.channel && !allowedChannels.has(body.channel)) {
    errors.push('channel must be one of web, mobile, branch, partner.');
  }

  const missingApplicantFields = getRequiredApplicantFields(body.applicant);
  if (missingApplicantFields.length > 0) {
    errors.push(`Missing required fields: ${missingApplicantFields.join(', ')}.`);
  }

  if (body.applicant && body.applicant.email && !body.applicant.email.includes('@')) {
    errors.push('applicant.email must be a valid email address.');
  }

  if (body.applicant && body.applicant.ssnLast4 && !/^\d{4}$/.test(body.applicant.ssnLast4)) {
    errors.push('applicant.ssnLast4 must contain exactly four digits.');
  }

  if (!body.consents || body.consents.privacyPolicyAccepted !== true || body.consents.eSignAccepted !== true) {
    errors.push('privacyPolicyAccepted and eSignAccepted consents must both be true.');
  }

  if (
    body.funding &&
    body.funding.initialDepositAmount !== undefined &&
    (typeof body.funding.initialDepositAmount !== 'number' || body.funding.initialDepositAmount < 0)
  ) {
    errors.push('funding.initialDepositAmount must be a non-negative number.');
  }

  if (
    body.employment &&
    body.employment.annualIncome !== undefined &&
    (typeof body.employment.annualIncome !== 'number' || body.employment.annualIncome < 0)
  ) {
    errors.push('employment.annualIncome must be a non-negative number.');
  }

  return errors;
}

function validateStatusUpdate(body) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request body must be a JSON object.'];
  }

  if (!body.status) {
    errors.push('status is required.');
  } else if (!allowedStatuses.has(body.status)) {
    errors.push('status must be one of submitted, in_review, approved, declined, cancelled.');
  }

  if (body.decisionReason !== undefined && typeof body.decisionReason !== 'string') {
    errors.push('decisionReason must be a string when provided.');
  }

  return errors;
}

function canTransition(fromStatus, toStatus) {
  return allowedTransitions[fromStatus] && allowedTransitions[fromStatus].has(toStatus);
}

function calculateRiskTier(body) {
  const income = body.employment && typeof body.employment.annualIncome === 'number'
    ? body.employment.annualIncome
    : 0;
  const deposit = body.funding && typeof body.funding.initialDepositAmount === 'number'
    ? body.funding.initialDepositAmount
    : 0;

  if (body.productCode === 'NORTHSTAR_PREMIER' && income < 100000) {
    return 'review';
  }

  if (income >= 75000 || deposit >= 1000) {
    return 'low';
  }

  return 'standard';
}

function createApplicationFromRequest(body) {
  const timestamp = new Date().toISOString();

  return {
    id: createApplicationId(),
    status: 'submitted',
    productCode: body.productCode,
    channel: body.channel || 'partner',
    applicant: {
      firstName: body.applicant.firstName,
      lastName: body.applicant.lastName,
      email: body.applicant.email,
      phone: body.applicant.phone,
      dateOfBirth: body.applicant.dateOfBirth,
      ssnLast4: body.applicant.ssnLast4,
      address: {
        line1: body.applicant.address.line1,
        city: body.applicant.address.city,
        state: body.applicant.address.state,
        postalCode: body.applicant.address.postalCode,
        country: body.applicant.address.country
      }
    },
    employment: {
      employmentStatus: body.employment?.employmentStatus || 'not_provided',
      annualIncome: body.employment?.annualIncome || 0
    },
    funding: {
      initialDepositAmount: body.funding?.initialDepositAmount || 0,
      fundingSource: body.funding?.fundingSource || 'not_provided'
    },
    consents: {
      privacyPolicyAccepted: body.consents.privacyPolicyAccepted,
      eSignAccepted: body.consents.eSignAccepted
    },
    requestedDebitCard: body.requestedDebitCard === undefined ? true : Boolean(body.requestedDebitCard),
    partnerReferenceId: body.partnerReferenceId || null,
    riskTier: calculateRiskTier(body),
    decisionReason: null,
    submittedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

module.exports = {
  allowedStatuses,
  canTransition,
  createApplicationFromRequest,
  validateCreateApplication,
  validateStatusUpdate
};

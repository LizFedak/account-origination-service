const express = require('express');
const { applications } = require('../data/applications');
const {
  canTransition,
  createApplicationFromRequest,
  validateCreateApplication,
  validateStatusUpdate
} = require('../utils/applicationRules');
const { envelope, errorResponse } = require('../utils/responses');

const router = express.Router();

function findApplication(applicationId) {
  return applications.find((application) => application.id === applicationId);
}

function notFound(req, res, applicationId) {
  return errorResponse(
    req,
    res,
    404,
    'APPLICATION_NOT_FOUND',
    `Application ${applicationId} was not found.`
  );
}

router.get('/', (req, res) => {
  const { status, productCode, channel } = req.query;
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isNaN(requestedLimit) ? 50 : Math.min(Math.max(requestedLimit, 1), 100);

  const filteredApplications = applications
    .filter((application) => !status || application.status === status)
    .filter((application) => !productCode || application.productCode === productCode)
    .filter((application) => !channel || application.channel === channel)
    .slice(0, limit);

  return res.json(
    envelope(req, filteredApplications, {
      count: filteredApplications.length
    })
  );
});

router.post('/', (req, res) => {
  const validationErrors = validateCreateApplication(req.body);

  if (validationErrors.length > 0) {
    return errorResponse(
      req,
      res,
      400,
      'VALIDATION_ERROR',
      validationErrors.join(' ')
    );
  }

  const application = createApplicationFromRequest(req.body);
  applications.push(application);

  return res.status(201).json(envelope(req, application));
});

router.get('/:applicationId', (req, res) => {
  const application = findApplication(req.params.applicationId);

  if (!application) {
    return notFound(req, res, req.params.applicationId);
  }

  return res.json(envelope(req, application));
});

router.patch('/:applicationId/status', (req, res) => {
  const application = findApplication(req.params.applicationId);

  if (!application) {
    return notFound(req, res, req.params.applicationId);
  }

  const validationErrors = validateStatusUpdate(req.body);

  if (validationErrors.length > 0) {
    return errorResponse(
      req,
      res,
      400,
      'VALIDATION_ERROR',
      validationErrors.join(' ')
    );
  }

  if (!canTransition(application.status, req.body.status)) {
    return errorResponse(
      req,
      res,
      409,
      'INVALID_STATUS_TRANSITION',
      `Cannot transition application ${application.id} from ${application.status} to ${req.body.status}.`
    );
  }

  application.status = req.body.status;
  application.decisionReason = req.body.decisionReason || application.decisionReason;
  application.updatedAt = new Date().toISOString();

  return res.json(envelope(req, application));
});

router.delete('/:applicationId', (req, res) => {
  const application = findApplication(req.params.applicationId);

  if (!application) {
    return notFound(req, res, req.params.applicationId);
  }

  if (!canTransition(application.status, 'cancelled')) {
    return errorResponse(
      req,
      res,
      409,
      'INVALID_STATUS_TRANSITION',
      `Cannot cancel application ${application.id} while it is ${application.status}.`
    );
  }

  application.status = 'cancelled';
  application.decisionReason = 'Application cancelled by request.';
  application.updatedAt = new Date().toISOString();

  return res.json(envelope(req, application));
});

module.exports = router;

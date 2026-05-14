const crypto = require('crypto');

function createCorrelationId() {
  return `corr_demo_${crypto.randomUUID()}`;
}

function correlationId(req, res, next) {
  req.correlationId = req.get('x-correlation-id') || createCorrelationId();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
}

module.exports = correlationId;

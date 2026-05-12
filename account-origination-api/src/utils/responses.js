function now() {
  return new Date().toISOString();
}

function envelope(req, data, meta = {}) {
  return {
    data,
    meta: {
      correlationId: req.correlationId,
      timestamp: now(),
      ...meta
    }
  };
}

function errorResponse(req, res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message,
      correlationId: req.correlationId || 'corr_demo_unavailable'
    }
  });
}

module.exports = {
  envelope,
  errorResponse,
  now
};

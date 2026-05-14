const { errorResponse } = require('../utils/responses');

function apiKeyAuth(req, res, next) {
  const expectedApiKey = process.env.API_KEY || 'demo-key';
  const providedApiKey = req.get('x-api-key');

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    return errorResponse(
      req,
      res,
      401,
      'UNAUTHORIZED',
      'Missing or invalid x-api-key header.'
    );
  }

  return next();
}

module.exports = apiKeyAuth;

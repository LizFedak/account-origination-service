const express = require('express');
const apiKeyAuth = require('./middleware/auth');
const correlationId = require('./middleware/correlationId');
const applicationsRouter = require('./routes/applications');
const { errorResponse, now } = require('./utils/responses');

const app = express();
const port = process.env.PORT || 3001;

app.use(correlationId);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} correlationId=${req.correlationId}`);
  next();
});

app.use(apiKeyAuth);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Account Origination API',
    timestamp: now(),
    correlationId: req.correlationId
  });
});

app.use('/applications', applicationsRouter);

app.use((req, res) => {
  errorResponse(req, res, 404, 'ROUTE_NOT_FOUND', `No route found for ${req.method} ${req.path}.`);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(req, res, 400, 'INVALID_JSON', 'Request body must contain valid JSON.');
  }

  console.error(`${new Date().toISOString()} error correlationId=${req.correlationId}`, err.message);
  return errorResponse(req, res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Account Origination API listening on port ${port}`);
  });
}

module.exports = app;

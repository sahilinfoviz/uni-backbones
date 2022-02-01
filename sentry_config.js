const Sentry = require("@sentry/node");

process.env.NODE_ENV === 'production' &&
 Sentry.init({
    dsn: "https://62bb85e5846b40109d027bccb9411314@o1132074.ingest.sentry.io/6177368",

    tracesSampleRate: 1.0,
  });
  

module.exports = Sentry;

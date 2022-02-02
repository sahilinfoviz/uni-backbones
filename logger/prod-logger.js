const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json } = format;
// const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
 
// const s3_stream = new S3StreamLogger({
//              bucket: "authemorod",
//       access_key_id: "AKIAYY4ZQQHZPHDNRWZI",
//   secret_access_key: "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"
// });
// const transport = new (transports.Stream)({
//     stream: s3_stream
//   });
// transport.on('error', function(err){
//     // there was an error!
//     some_other_logging_transport.log('error', 'logging transport error', err)
// });

function buildProdLogger(){
    return createLogger({
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'authentication-service'},
        transports: [
            new transports.File({ filename: 'prod.log'}),
            //transport
        ],
    });
}

module.exports = buildProdLogger;
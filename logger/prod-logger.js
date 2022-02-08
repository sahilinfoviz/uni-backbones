const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json } = format;
require('dotenv').config();
// const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
 
// const s3_stream = new S3StreamLogger({
//              bucket: process.env.AWS_BUCKET_NAME,
//       access_key_id: process.env.ACCESS_KEY,
//   secret_access_key: process.env.SECRET_KEY_ID
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
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const app = require('./api');
const logger = require('./logger');
require('dotenv').config();
const PORT = process.env.PORT;

if (cluster.isMaster) {
    
    logger.info(`Number of CPUs is ${totalCPUs}`);
    logger.info(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on("exit", (worker, code, signal) => {
      logger.info(`worker ${worker.process.pid} died`);
      logger.info("Let's fork another worker!");
      cluster.fork();
    });
  }else {

    // start the app
    app.listen(PORT, () => {
        logger.log("info",`backend server is running on port - ${PORT}`);
      });
   }

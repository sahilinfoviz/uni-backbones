const app = require('./api');
const logger = require('./logger');
require('dotenv').config();
const PORT = process.env.PORT;

// start the app
app.listen(PORT, () => {
    logger.log("info",`backend server is running on port - ${PORT}`);
  });
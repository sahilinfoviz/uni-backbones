const app = require('./api');
require('dotenv').config();
const PORT = process.env.PORT;

// start the app
app.listen(PORT, () => {
    console.log(`backend server is running on port - ${PORT}`);
  });
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 5000;

// For local development: start traditional server
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  }).catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
}

module.exports = app;

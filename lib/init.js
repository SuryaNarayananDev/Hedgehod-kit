require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');
const middleware = require('./middleware');

function init(config) {
  const app = config.app;
  if (!app) throw new Error("Express app instance is required!");

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use('/auth', routes(config, middleware));

  return {
    requireAuth: middleware.requireAuth,
    requireVerified: middleware.requireVerified
  };
}

module.exports = { init };

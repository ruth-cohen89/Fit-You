const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Synchronous exeptions on the app
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ⛔ Shutting down...');
  console.log(err.name, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB 🙂'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Promise rejections (outside of the app)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('New error:', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

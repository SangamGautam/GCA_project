import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/index.js'; // Adjust the path as necessary

const app = express();

// Explicitly set CORS options
const allowedOrigins = ['http://localhost:4200'];
const corsOptions = (req, callback) => {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true, optionsSuccessStatus: 200 });
  } else {
    callback(null, { origin: false });
  }
};

// Use CORS with options
app.use(cors(corsOptions));

app.use(express.json());

// Use the student routes
app.use('/api', studentRoutes);

// Catch-all route for 404 Not Found
app.use((req, res) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

// Server listen on PORT
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Endpoint to fetch data from the API
app.post('/fetch-fx-rates', async (req, res) => {
  try {
    const { pairs, start_date, end_date } = req.body;

    // Validate required parameters
    if (!pairs || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get('https://api.challenges.performativ.com/fx-rates', {
      headers: {
        'x-api-key': 'FSPkaSbQA55Do0nXhSZkH9eKWVlAMmNP7OKlI2oA'
      },
      params: {
        pairs,
        start_date,
        end_date
      }
    });
    
    // Send the API response back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.', retryAfter: error.response.headers['retry-after'] || 60 });
    } else {
      res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

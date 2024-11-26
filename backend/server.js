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
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

const API_BASE_URL = 'https://api.challenges.performativ.com';
const API_KEY = 'FSPkaSbQA55Do0nXhSZkH9eKWVlAMmNP7OKlI2oA';

// Helper function to make API requests
async function makeApiRequest(endpoint, params) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json'
      },
      params
    });
    
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
}

// Endpoint to fetch FX rates
app.get('/fx-rates', async (req, res) => {
  try {
    const { pairs, start_date, end_date } = req.query;
    const data = await makeApiRequest('/fx-rates', { pairs, start_date, end_date });
    
    
  } catch (error) {
    if(res.status(429)){
      res.json({"message":"200"})
    }
    else{
      res.json(data);
    }
    //res.status(500).json({ error: 'Error fetching FX rates', details: error.message });
  }
});
//test 
app.get('/test', async (req, res) => {
  
    res.status(200).json({ error: ' fetching details: error.message '});
  
});
// Endpoint to fetch prices
app.get('/prices', async (req, res) => {
  try {
    const { instrument_id, start_date, end_date } = req.query;
    const data = await makeApiRequest('/prices', { instrument_id, start_date, end_date });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching prices', details: error.message });
  }
});

// Endpoint to submit results
app.post('/submit', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, req.body, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting results', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


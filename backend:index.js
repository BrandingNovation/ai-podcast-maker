const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Environment variables
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/podcast';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.post('/api/generate-podcast', async (req, res) => {
  try {
    const { script, characters, musicStyle, musicVolume } = req.body;

    // Validate input
    if (!script || !characters || characters.length === 0) {
      return res.status(400).json({ error: 'Script and characters are required' });
    }

    // Send request to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, {
      script,
      characters,
      musicStyle,
      musicVolume
    });

    // Return the response from n8n
    res.json(response.data);
  } catch (error) {
    console.error('Error generating podcast:', error);
    res.status(500).json({ error: 'Failed to generate podcast' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'AI Podcast Maker API',
    version: '1.0.0'
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
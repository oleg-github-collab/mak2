/**
 * Roots & Wings Payment Server
 * Backend for processing LiqPay payments
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const paymentRoutes = require('./routes/payment');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment info on startup
console.log('🚀 Starting Roots & Wings Server...');
console.log(`📌 PORT from env: ${process.env.PORT}`);
console.log(`📌 Using PORT: ${PORT}`);
console.log(`📌 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`📌 __dirname: ${__dirname}`);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for LiqPay iframe
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
// For Railway (Docker): files in /app/public/
// For local development: files in parent directory
const publicDir = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..');

app.use(express.static(publicDir));
logger.info(`📁 Serving static files from: ${publicDir}`);

// API routes
app.use('/api/payment', paymentRoutes);

// Health check endpoint (required by Railway)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Alternative health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Debug endpoint - check file system
app.get('/api/debug/files', (req, res) => {
    const fs = require('fs');
    try {
        const files = {
            __dirname: __dirname,
            publicDir: publicDir,
            'public exists': fs.existsSync(path.join(__dirname, 'public')),
            'public contents': fs.existsSync(path.join(__dirname, 'public'))
                ? fs.readdirSync(path.join(__dirname, 'public'))
                : 'directory not found',
            'index.html exists': fs.existsSync(path.join(publicDir, 'index.html')),
            'success.html exists': fs.existsSync(path.join(publicDir, 'success.html')),
            'error.html exists': fs.existsSync(path.join(publicDir, 'error.html'))
        };
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve success and error pages
app.get('/success', (req, res) => {
    const filePath = path.join(publicDir, 'success.html');
    logger.info(`📄 Serving success.html from: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            logger.error(`❌ Error serving success.html:`, err.message);
            res.status(500).send('Error loading page');
        }
    });
});

app.get('/error', (req, res) => {
    const filePath = path.join(publicDir, 'error.html');
    logger.info(`📄 Serving error.html from: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            logger.error(`❌ Error serving error.html:`, err.message);
            res.status(500).send('Error loading page');
        }
    });
});

// Serve main index page
app.get('/', (req, res) => {
    const fs = require('fs');
    const filePath = path.join(publicDir, 'index.html');

    logger.info(`📄 Attempting to serve index.html`);
    logger.info(`   publicDir: ${publicDir}`);
    logger.info(`   filePath: ${filePath}`);
    logger.info(`   __dirname: ${__dirname}`);
    logger.info(`   NODE_ENV: ${process.env.NODE_ENV}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        logger.error(`❌ File not found: ${filePath}`);

        // Try to list directory contents
        const publicExists = fs.existsSync(publicDir);
        logger.error(`   public/ exists: ${publicExists}`);

        if (publicExists) {
            try {
                const files = fs.readdirSync(publicDir);
                logger.error(`   public/ contents: ${JSON.stringify(files)}`);
            } catch (e) {
                logger.error(`   Cannot read public/: ${e.message}`);
            }
        }

        // Return helpful error page
        return res.status(500).send(`
            <h1>File Not Found</h1>
            <p>Looking for: <code>${filePath}</code></p>
            <p>Public dir: <code>${publicDir}</code></p>
            <p>__dirname: <code>${__dirname}</code></p>
            <p>NODE_ENV: <code>${process.env.NODE_ENV || 'not set'}</code></p>
            <p>Public exists: <code>${publicExists}</code></p>
            <hr>
            <p><a href="/api/debug/files">Check debug info</a></p>
        `);
    }

    res.sendFile(filePath, (err) => {
        if (err) {
            logger.error(`❌ Error serving index.html:`, err.message);
            res.status(500).send(`Error: ${err.message}`);
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(err.status || 500).json({
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'An error occurred'
                : err.message
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Site URL: ${process.env.SITE_URL || 'http://localhost:' + PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;

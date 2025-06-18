const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const { log } = require('./utils/logger');
const sentimentRoutes = require('./routes/sentiment');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Add cache-busting headers for API endpoints
app.use('/api', (req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// Serve built UI static files
app.use(express.static(path.join(__dirname, '..', 'new-ui-backend', 'dist')));

// Legacy public folder (if needed)
app.use('/legacy', express.static(path.join(__dirname, 'public')));

// Database connection
let db;
async function initDb() {
    const dbPath = path.join(__dirname, '..', 'sentiments.db');
    log.info('=== DATABASE INITIALIZATION ===');
    log.info('Attempting to open database at path:', dbPath);
    log.info('Resolved absolute path:', path.resolve(dbPath));
    
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    
    log.info('Database connected successfully');
    
    // Test query to verify database content
    try {
        const userCount = await db.get('SELECT COUNT(*) as count FROM users');
        const sampleUser = await db.get('SELECT handle_id, company_name FROM users LIMIT 1');
        log.info(`Database contains ${userCount.count} users`);
        log.info('Sample user from database:', sampleUser);
    } catch (testError) {
        log.error('Database test query failed:', testError);
    }
    
    log.info('=== END DATABASE INIT ===');
}

// Attach db to request object
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api', sentimentRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    log.info('Client connected');
    socket.on('disconnect', () => {
        log.info('Client disconnected');
    });
});

// Update sentiment endpoint to emit socket event
app.post('/api/sentiment', async (req, res) => {
    const { handleId, sentiment } = req.body;

    try {
        await db.run(
            'INSERT INTO sentiments (handle_id, sentiment) VALUES (?, ?)',
            [handleId, sentiment]
        );

        // Get updated counts
        const counts = await db.all(`
            SELECT sentiment, COUNT(*) as count 
            FROM sentiments 
            GROUP BY sentiment
        `);

        // Transform counts for the dashboard
        const transformedCounts = counts.reduce((acc, curr) => {
            acc[curr.sentiment] = curr.count;
            return acc;
        }, { GREAT: 0, MEH: 0, UGH: 0 });

        // Emit update to all connected clients
        io.emit('sentimentUpdate', transformedCounts);

        res.json({ success: true });
    } catch (error) {
        log.error('Failed to record sentiment:', error);
        res.status(500).json({ error: 'Failed to record sentiment' });
    }
});

// Catch-all handler: send back React's index.html file for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'new-ui-backend', 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;

initDb()
    .then(() => {
        server.listen(PORT, () => {
            log.info(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        log.error('Failed to initialize database:', error);
        process.exit(1);
    }); 
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
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
let db;
async function initDb() {
    db = await open({
        filename: path.join(__dirname, '..', 'sentiments.db'),
        driver: sqlite3.Database
    });
    
    log.info('Database connected');
}

// Attach db to request object
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api', sentimentRoutes);

// Add this endpoint after your other routes
app.get('/api/sentiment/counts', async (req, res) => {
    try {
        const counts = await db.all(`
            SELECT sentiment, COUNT(*) as count 
            FROM sentiments 
            GROUP BY sentiment
        `);

        log.info('Fetched sentiment counts:', counts);
        res.json(counts);
    } catch (error) {
        log.error('Failed to get sentiment counts:', error);
        res.status(500).json({ error: 'Failed to get counts' });
    }
});

// Add this new endpoint
app.get('/api/sentiment/recent', async (req, res) => {
    try {
        const recentActivities = await db.all(`
            SELECT sentiment, timestamp 
            FROM sentiments 
            ORDER BY timestamp DESC 
            LIMIT 10
        `);
        
        log.info('Fetched recent activities:', recentActivities);
        res.json(recentActivities);
    } catch (error) {
        log.error('Failed to get recent activities:', error);
        res.status(500).json({ error: 'Failed to get recent activities' });
    }
});

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
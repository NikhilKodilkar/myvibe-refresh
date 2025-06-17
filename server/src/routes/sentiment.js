const express = require('express');
const router = express.Router();
const { log } = require('../utils/logger');

// Generate random 6-digit number
function generateRandomSuffix() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create unique handle
async function createUniqueHandle(db, baseHandle) {
    let handleId;
    let isUnique = false;
    
    while (!isUnique) {
        handleId = `${baseHandle}-${generateRandomSuffix()}`;
        const existing = await db.get('SELECT handle_id FROM users WHERE handle_id = ?', [handleId]);
        if (!existing) {
            isUnique = true;
        }
    }
    
    return handleId;
}

// Registration endpoint
router.post('/register', async (req, res) => {
    const { handle, company } = req.body;
    const ip = req.ip;

    try {
        // Check if IP already registered
        const existingIP = await req.db.get('SELECT * FROM users WHERE ip_address = ?', [ip]);
        if (existingIP) {
            log.warn(`Registration attempted with existing IP: ${ip}`);
            return res.status(400).json({ error: 'Already registered from this location' });
        }

        // Create unique handle
        const handleId = await createUniqueHandle(req.db, handle);
        
        // Insert new user
        await req.db.run(
            'INSERT INTO users (handle_id, company_name, ip_address) VALUES (?, ?, ?)',
            [handleId, company, ip]
        );

        log.info(`New user registered: ${handleId} for company: ${company}`);
        res.json({ handleId });

    } catch (error) {
        log.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Sentiment endpoint
router.post('/sentiment', async (req, res) => {
    const { handleId, sentiment } = req.body;

    try {
        await req.db.run(
            'INSERT INTO sentiments (handle_id, sentiment) VALUES (?, ?)',
            [handleId, sentiment]
        );

        log.info(`Sentiment recorded: ${sentiment} from ${handleId}`);
        res.json({ success: true });

    } catch (error) {
        log.error('Failed to record sentiment:', error);
        res.status(500).json({ error: 'Failed to record sentiment' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { handle } = req.body;
    const ip = req.ip;

    try {
        log.info(`Login attempt for handle: ${handle}`);

        // Find user by handle (partial match before the -number suffix)
        const user = await req.db.get(
            "SELECT * FROM users WHERE handle_id LIKE ?",
            [`${handle}-%`]
        );

        if (!user) {
            log.warn(`Login failed: Handle ${handle} not found`);
            return res.status(404).json({ error: 'Handle not found' });
        }

        // If found, update IP address and return success
        await req.db.run(
            'UPDATE users SET ip_address = ? WHERE handle_id = ?',
            [ip, user.handle_id]
        );

        log.info(`Login successful for ${user.handle_id}`);
        res.json({ 
            handleId: user.handle_id,
            company: user.company_name
        });

    } catch (error) {
        log.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router; 
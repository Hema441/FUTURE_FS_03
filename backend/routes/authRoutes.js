const express = require('express');
const router = express.Router();

// Simple Hardcoded Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // In a real app, you would check against a DB with hashed passwords
    if (username === 'admin' && password === 'aura123') {
        res.json({ success: true, token: 'fake-jwt-token-for-demo', message: 'Welcome back, Admin!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;

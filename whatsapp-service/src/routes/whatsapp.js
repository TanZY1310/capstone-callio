const express = require('express');
const router = express.Router();
const { initializeClient, getState } = require('../whatsapp');

router.get('/', (req, res) => {
    res.send('Server is up and running!');
});

router.post('/whatsapp/connect', (req, res) => {
    initializeClient();
    res.status(200).json({ status: 'connecting' });
});

router.post("/send/:custId", (req, res)=>{
    const id = req.params.userId;
})

router.get('/whatsapp/status', (req, res) => {
    res.json(getState());
});

module.exports = router;
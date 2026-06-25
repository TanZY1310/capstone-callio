const express = require('express');
const router = express.Router();
const { initializeClient, getState, getMessages, sendMessage } = require('../whatsapp');

router.get('/', (req, res) => {
    res.send('Server is up and running!');
});

router.post('/whatsapp/connect', (req, res) => {
    initializeClient();
    res.status(200).json({ status: 'connecting' });
});

router.get('/whatsapp/status', (req, res) => {
    res.json(getState());
});

// Read message by Cust_ID
router.get('whatsapp/read', (req, res) =>{
    
    try{
        const result = getMessages();
        return res.json(result);
    }
    catch (e){
        res.status(500).json({error:e.message})
    }
});

// Send message
router.post('/whatsapp/send', async (req, res) => {

    try{
        const { phone, message } = req.body;
        // phone and message come from req.body (the json= payload from Python)
        const result = await sendMessage(phone, message);
        res.json(result);
    } catch (e){
        res.status(e.statusCode || 500).json({error:e.message});
    }
});

module.exports = router;
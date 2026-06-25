const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const qrcodeTerminal = require('qrcode-terminal');

let client;
let state = {
  status: 'disconnected', // disconnected | connecting | qr_ready | connected
  qr: null,
};

class ConnectionError extends Error { 
  constructor(message) { 
    super(message); 
    this.name = 'ConnectionError'; 
    this.statusCode = 503; 
  } 
} 

function initializeClient() {
  // guard: if already connecting/connected, do nothing
  if (state.status == 'connected'){
        return;
  }

  // create new Client with LocalAuth
  // default relevant session files are stored under .wwebjs_auth
  // LocalAuth stored in Cloud SQL upon deployment 
  client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    },
  });
  
  // When the client is ready, run this code (only once)
  client.once('ready', () => {
      console.log('Client is ready!');
  });

  // When the client received QR-Code
  client.on("qr", async (qr) => {
     console.log("QR received\n converting to base64 image...");
     // Convert QR string to a PNG data URL
     state.qr = await qrcode.toDataURL(qr);
     console.log("QR base64 ready\nOpen http://localhost:3001 to scan");
     state.status = 'qr_ready';
  });
 
  // Cross-check this later
  client.on("ready", () => {
    state.status = 'connected';
    console.log("Client ready");
    state.qr = null;
  });

  // Cross-check this later
  client.on("authenticated", () => {
    state.status = 'connected';
    console.log("Authenticated");
  });

  client.on("auth_failure", (msg) => {
    state.status = 'disconnected';
    console.error("Auth failure:", msg);
  });

  client.on("disconnected", (reason) => {
    state.status = 'disconnected';
    console.log("Disconnected:", reason);
  });

  // Incoming message listener
  /*client.on("message", async (msg) => {
    console.log(`\nNew message from ${msg.from}: ${msg.body}`);

    if (msg.body === "!info") {
      const contact = await msg.getContact();
      await msg.reply(
        `Name: ${contact.pushname}\nNumber: ${contact.number}\nIs Business: ${contact.isBusiness}`
      );
    }
  });*/

  // Start your client
  client.initialize();
}

async function sendMessage(phone, message){

  // guard clause
  if (getState().status !== 'connected') {
    throw new ConnectionError("You're not connected")   
  };

  try {
    const chatId = phone.includes("@c.us") ? phone : `${phone}@c.us`;
    const result = await client.sendMessage(chatId, message);
    return({
        status: "sent",
        messageId: result.id._serialized,
        timestamp: result.timestamp,
        to: chatId,
    });
  } catch (e) {
      throw new Error("Error in send message", {cause: e});
  }
}

async function getMessages(phone, limit){
  // guard clause
  if (getState().status !== 'connected') {
    throw new ConnectionError("You're not connected")   
  };

  try {
    const chatId = phone.includes("@c.us") ? phone : `${phone}@c.us`;
    const chat = await client.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit: parseInt(limit) });
    return(messages.map(m => ({
      id: m.id._serialized,
      from: m.from,
      to: m.to,
      body: m.body,
      timestamp: m.timestamp,
      fromMe: m.fromMe,
      type: m.type,
      hasMedia: m.hasMedia,
    })));
  }
  catch (e) {
    throw new Error(`Error in read message: ${e.message}`, {cause: e});
  }
}

function getState() {
  return state;
}

// exported functions that are accessible upon = require(../whatsapp)
module.exports = { initializeClient, sendMessage, getMessages, getState };
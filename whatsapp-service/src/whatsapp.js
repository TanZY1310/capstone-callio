const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode");
const qrcodeTerminal = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

let client;
let state = {
  restarting: false,
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

function isExpectedReadMiss(error) {
  const message = error?.message || '';
  return (
    message.includes('Attempted to use detached Frame') ||
    message.includes('Cannot read properties of undefined') ||
    message.includes('Cannot read property') ||
    message.includes('Evaluation failed') ||
    message.includes('Protocol error') ||
    message.includes('Session closed') ||
    message.includes('Target closed')
  );
}

function clearStaleServiceWorker() {
  // A Service Worker registered by a previous session intercepts WA Web's
  // navigation request inside the page, before Puppeteer's CDP-level request
  // interception (which webVersionCache/webVersion relies on) ever sees it —
  // silently undoing the version pin below on every run after the first.
  // Wiping just this subfolder (not the whole LocalAuth profile) forces a
  // clean SW state without touching login/cookies/chat history.
  //
  // This must stay a plain, self-contained step: no client.destroy() and no
  // calling initializeClient() from in here. This function runs *inside*
  // initializeClient()'s own startup sequence — calling back into it (or
  // destroying the client it's about to build) creates an unbounded
  // destroy -> reinit -> destroy loop with no exit condition.
  const swPath = path.join(process.cwd(), '.wwebjs_auth', 'session', 'Default', 'Service Worker');
  try {
    fs.rmSync(swPath, { recursive: true, force: true });
  } catch (err) {
    console.error('Error clearing stale Service Worker cache:', err);
  }
}

async function initializeClient() {
  // guard: if already connecting/connected, do nothing
  if (state.status == 'connected'){
        return;
  }

  clearStaleServiceWorker();

  // create new Client with LocalAuth
  // default relevant session files are stored under .wwebjs_auth
  // LocalAuth stored in Cloud SQL upon deployment 
  client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-features=MemorySaverMode',
        '--memory-pressure-off'
      ],
    },
    // Pin WA Web to a known-working snapshot instead of whatever build WA is
    // serving live right now — that live build is what broke Store access
    // (getChatById/getChats throwing "r: r"). Snapshot pulled from the
    // community-maintained cache wwebjs itself points users to for this.
    // If this specific version also breaks, browse
    // https://github.com/wppconnect-team/wa-version/tree/main/html for a
    // nearby one and swap the version string below.
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/{version}.html',
    },
    webVersion: '2.3000.1042852868-alpha',
  });
  
  // When the client is ready, run this code (only once)
  client.once('ready', () => {
      console.log('Client is ready!');
      state.status = 'connected';
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
  client.on("ready", async () => {
    const page = client.pupPage;
    state.status = 'connected';

    console.log("Client ready");
    state.qr = null;

    page.on('error', async (err) => {
        if (err.message.includes('Execution context was destroyed')) {
            console.log('!!! Global Debug: Sleep/Wake context crash detected !!!');
            await handleCrashAndRestart();
        }
    })
  });

  // Cross-check this later
  client.on("authenticated", () => {
    state.status = 'connected';
    console.log("Authenticated");
  });

  client.on("change_state", (state) => {
    console.log("WA connection state changed:", state);
  });


  client.on("auth_failure", (msg) => {
    state.status = 'disconnected';
    console.error("Auth failure:", msg);
  });

  client.on("disconnected", async (reason) => {
    state.status = 'disconnected';
    console.log("Disconnected:", reason);

    try {
          // Destroy the old disconnected client properly
          await client.destroy();
          if (client == null) {
            console.log("Client destroyed.")
          }
        } catch (err) {
            console.error('Error destroying client:', err);
        }

        // Wait a few seconds, then initialize a new instance
        setTimeout(async () => {
            console.log('Re-initializing client in initializeClient...');
            await handleCrashAndRestart(); //change back to initializeClient() if there's extra error
        }, 5000);
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
  client.initialize().catch((err) => {
    // Clearing the Service Worker folder above makes WA Web do an extra
    // self-reload while (re-)installing a fresh one during boot; if that
    // reload lands mid-injection, wwebjs's page.evaluate calls die with
    // "Execution context was destroyed". Left uncaught this rejects
    // client.initialize()'s promise with nothing listening, which crashes
    // the whole process. Retry instead of letting that happen.
    console.error('client.initialize() failed:', err);
    state.status = 'disconnected';
    setTimeout(async () => {
      console.log('Re-initializing client after failed initialize()...');
      await handleCrashAndRestart();
    }, 5000);
  });
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

async function getMessages(phone, limit, retries = 3){
  // guard clause
  if (getState().status !== 'connected') {
    throw new ConnectionError("You're not connected")
  };

  if (!phone || typeof phone !== 'string') {
    return [];
  }

  const chatId = phone.includes("@c.us") ? phone : `${phone}@c.us`;

  // getChatById falls back to findOrCreateLatestChat() for numbers with no
  // cached chat yet, which throws WA's own cryptic internal error when the
  // number isn't a valid WhatsApp account. Check registration first so that
  // case is a clean empty result instead of 3 retries + a 500.
  try {
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      console.warn(`${phone} (${chatId}) is not a registered WhatsApp number — no chat history available`);
      return [];
    }
  } catch (e) {
    if (isExpectedReadMiss(e)) {
      // The session itself is broken (e.g. laptop woke from sleep and WA
      // Web's frame got torn down) — getChatById below would hit the exact
      // same error, so recover now instead of wasting a doomed call on it.
      await handleCrashAndRestart(`isRegisteredUser(${chatId}): ${e.message}`);
      return [];
    }
    console.warn(`Could not verify WhatsApp registration for ${chatId}, proceeding anyway:`, e.message);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const chat = await client.getChatById(chatId);
      if (!chat) {
        return [];
      }

      const messages = await chat.fetchMessages({ limit: parseInt(limit) });
      if (!Array.isArray(messages)) {
        return [];
      }

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
      console.error(`getMessages attempt ${attempt}/${retries} failed for ${phone}:`, e);
      if (e.stack) {
        console.error(e.stack);
      }

      if (isExpectedReadMiss(e)) {
        // Structural failure (detached frame, closed session/target, etc.) —
        // retrying won't help, the page is gone. Recover immediately instead
        // of burning the remaining retry attempts on a call that can't succeed.
        await handleCrashAndRestart(`getChatById(${chatId}) after ${attempt}/${retries} attempts: ${e.message}`);
        return [];
      }

      const isLastAttempt = attempt === retries;

      if (!isLastAttempt) {
        // WA Web's internal Store can still be hydrating right after 'ready' fires;
        // back off and retry before treating this as a real failure.
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }

      throw new Error(`Error in read message: ${e.message}`, {cause: e});
    }
  }
}


async function handleCrashAndRestart(reason) {
    if (state.restarting) return; // Prevent multiple restarts from firing at once
    state.restarting = true;
    state.status = 'disconnected'; // Halt the polling loop

    console.log(`Context destroyed or client disconnected. Initiating clean restart... (${reason})`);

    try {
        // 1. Force kill the underlying puppeteer browser if it's hanging
        if (client.pupBrowser) {
            await client.pupBrowser.close().catch(() => {});
        }
        // 2. Await the official library destruction
        await client.destroy().catch(() => {});
        console.log('Old client successfully destroyed in handleCrashAndRestart.');
    } catch (e) {
        console.error('Error during destruction phase:', e);
    }

    // 3. Wait for the laptop's network stack to fully wake up and stabilize
    console.log('Waiting 10 seconds for network stability...');
    setTimeout(async () => {
        state.restarting = false;
        console.log('Re-initializing WhatsApp Client from handleCrashAndRestart...');
        await initializeClient();
    }, 10000);
}


function getState() {
  return state;
}

// exported functions that are accessible upon = require(../whatsapp)
module.exports = { initializeClient, sendMessage, getMessages, getState };

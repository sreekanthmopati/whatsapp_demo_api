// import express, { Request, Response, NextFunction } from "express";
// import dotenv from 'dotenv';
// import sessionRoutes from "./routes/SessionRoute";


// dotenv.config();
// const cors = require("cors");

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;

// //const caseSheetRoutes = require("./routes/caseSheetRoutes");
// console.log("Registering routes...");


// app.use(express.json());
// app.use("/auth", sessionRoutes);


// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(err); // Logs error to console

//   res.status(err.status || 500).json({
//     message: err.message || "Something went wrong",
//   });
// });

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import axios from "axios";

dotenv.config();

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const PORT = 5000;

/* ============================
   WHATSAPP CONFIG (INLINE)
   ============================ */

const VERIFY_TOKEN = "my_verify_token"; // same value in Meta dashboard
const WHATSAPP_TOKEN = "EAAMJj28BZBQwBQZAy1JibIMiyjybJZCExpZAD6HPXKF4fZCKFJbPAX6mhkaYUFD7ZC4PmPrH1bUG0vZCBAXHB4g2hsF7wgZA8WAwWBT6cp8sN56I6exIhcq701sX4HZA9RLbZBPjY1VVGPrjTrnqCeRPFgqPtZBif31Un4g3upeVdp6R2J9f8qasNrF2WmPCRS7Yhqy";
const PHONE_NUMBER_ID = "974845145707835";

/* ============================
   ROOT CHECK
   ============================ */

app.get("/", (req, res) => {
  res.send("WhatsApp bot server running ✅");
});

/* ============================
   WEBHOOK VERIFICATION (GET)
   ============================ */

app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
   res.status(200).send(challenge);
    return ;
  }

   res.sendStatus(403);
   return;
});

/* ============================
   RECEIVE MESSAGES (POST)
   ============================ */

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message){
 res.sendStatus(200);
 return;
    } 

    const from = message.from;

    /* ---------- TEXT MESSAGE ---------- */
    if (message.type === "text") {
      const text = message.text.body.trim().toLowerCase();
      console.log("Incoming text:", text);

      // 👉 Respond to ANY text
      await sendWelcomeButtons(from);
    }

    /* ---------- BUTTON CLICK (CORRECT WAY) ---------- */
    if (
      message.type === "interactive" &&
      message.interactive?.type === "button_reply"
    ) {
      const payload = message.interactive.button_reply.id;
      console.log("Button clicked:", payload);

      if (payload === "BTN_1") {
        await sendTextMessage(from, "🤖 You clicked Button 1");
      } else if (payload === "BTN_2") {
        await sendTextMessage(from, "🤖 You clicked Button 2");
      } else if (payload === "BTN_3") {
        await sendTextMessage(from, "🤖 You clicked Button 3");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200); // MUST always be 200
  }
});

/* ============================
   SEND BUTTON MESSAGE
   ============================ */

async function sendWelcomeButtons(to: string) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "🧪 Button test. Click any button:",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "BTN_1",
                title: "Button 1",
              },
            },
            {
              type: "reply",
              reply: {
                id: "BTN_2",
                title: "Button 2",
              },
            },
            {
              type: "reply",
              reply: {
                id: "BTN_3",
                title: "Button 3",
              },
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

/* ============================
   SEND TEXT MESSAGE
   ============================ */

async function sendTextMessage(to: string, body: string) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

/* ============================
   ERROR HANDLER
   ============================ */

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

/* ============================
   START SERVER
   ============================ */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


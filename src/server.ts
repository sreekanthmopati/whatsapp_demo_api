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



dotenv.config();

const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(cors());
app.use(express.json());

const PORT = 5000;

/* ============================
   TEMP WHATSAPP CONFIG (INLINE)
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
   1️⃣ WEBHOOK VERIFICATION (GET)
   ============================ */

app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    res.status(200).send(challenge);
     return;
  }

  res.sendStatus(403);
   return;
});

/* ============================
   2️⃣ RECEIVE MESSAGES (POST)
   ============================ */

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
       res.sendStatus(200);
       return
    }

    const from = message.from;

    /* -------- TEXT MESSAGE -------- */
    if (message.type === "text") {
      const text = message.text.body.toLowerCase();
      console.log("Incoming text:", text);

      if (text === "hi" || text === "hello") {
        await sendWelcomeButtons(from);
      } else {
        await sendTextMessage(
          from,
          "❓ Please use the buttons below. Send *Hi* to start."
        );
      }
    }

    /* -------- BUTTON RESPONSE -------- */
    // if (message.type === "button") {
    //   const payload = message.button.payload;
    //   console.log("Button clicked:", payload);

    //   if (payload === "ORDER_HELP") {
    //     await sendTextMessage(from, "📦 Please share your Order ID");
    //   } else if (payload === "TRACK_ORDER") {
    //     await sendTextMessage(from, "🔍 Please enter your Order ID to track");
    //   } else if (payload === "SUPPORT") {
    //     await sendTextMessage(
    //       from,
    //       "📞 Our support team will contact you shortly."
    //     );
    //   }
    // }

    /* ---------- BUTTON CLICK ---------- */
if (message.type === "button") {
  const payload = message.button.payload;
  console.log("Button clicked:", payload);

  if (payload === "BTN_1") {
    await sendTextMessage(from, "✅ You clicked Button 1");
  } 
  else if (payload === "BTN_2") {
    await sendTextMessage(from, "✅ You clicked Button 2");
  } 
  else if (payload === "BTN_3") {
    await sendTextMessage(from, "✅ You clicked Button 3");
  }
}


    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200); // ALWAYS return 200 to Meta
  }
});

/* ============================
   3️⃣ SEND BUTTON MESSAGE
   ============================ */

// async function sendWelcomeButtons(to: string) {
//   await axios.post(
//     `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
//     {
//       messaging_product: "whatsapp",
//       to,
//       type: "interactive",
//       interactive: {
//         type: "button",
//         body: {
//           text: "👋 Welcome! How can I help you today?",
//         },
//         action: {
//           buttons: [
//             {
//               type: "reply",
//               reply: {
//                 id: "ORDER_HELP",
//                 title: "📦 Order help",
//               },
//             },
//             {
//               type: "reply",
//               reply: {
//                 id: "TRACK_ORDER",
//                 title: "🔍 Track order",
//               },
//             },
//             {
//               type: "reply",
//               reply: {
//                 id: "SUPPORT",
//                 title: "📞 Talk to support",
//               },
//             },
//           ],
//         },
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${WHATSAPP_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }


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
   4️⃣ SEND TEXT MESSAGE
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

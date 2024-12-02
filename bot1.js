const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

console.log(process.env.BOT_API_KEY);
const token = process.env.BOT_API_KEY;
console.log("Bot started");

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Store user IDs and their corresponding chat IDs
const chatMembers = {}; // key: chatId, value: set of userIds

let messageCounter = 0;
let lastMessageId = null;

// The message that will be sent after every 10 messages
const warningMessage = `
➖➖➖➖➖➖➖➖➖➖➖➖➖
‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼
कृपया ध्यान दें हम किसी से किसी के
पर्सनल में जाकर पेमेंट नहीं मांगते और ना कोई किसी प्रकार का ओटीपी , नाही किसी प्रकार का टेलीग्राम का एसएस और ना ही किसी को पर्सनल कॉल करते है अगर हमारे नाम से आपके पास कोई पेमेंट मांगता है तो सीधा ब्लॉक कर देना क्योंकि वह चोर है अगर आप फिर भी पेमेंट करते हो तो उसके जिम्मेदार आप खुद होंगे हम नहीं होंगे
➖➖➖➖➖➖➖➖➖➖➖➖➖
A.V.A.U ONLINE GAME CLUB
➖➖➖➖➖➖➖➖➖➖➖➖➖
`;

// Track messages and store user IDs
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  messageCounter++;

  lastMessageId = msg.message_id;

  if (messageCounter % 3 === 0) {
    // Wait for 2 seconds before replying
    setTimeout(() => {
      bot.sendMessage(chatId, warningMessage, {
        reply_to_message_id: lastMessageId, // Reply to the last message
      });
    }, 2000); // 2-second delay
  }

  // Initialize the chat if it's not already in the object
  if (!chatMembers[chatId]) {
    chatMembers[chatId] = new Set();
  }

  // Add the user ID to the set of user IDs for this chat
  chatMembers[chatId].add(userId);

  console.log(userId, chatId);

  // Respond to the user
  const message = msg.text;
  //   bot.sendMessage(chatId, `You said: ${message}`);
});

// Handle /start command
bot.onText("/start", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hello! How can I help you?");
});

// Handle /lock command
bot.onText("/lock", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  console.log(`User ID: ${userId}, Chat ID: ${chatId}`);

  // Check if the user is an admin of the chat
  const admins = await bot.getChatAdministrators(chatId);
  const isAdmin = admins.some((admin) => admin.user.id === userId);

  if (isAdmin) {
    // Lock the chat: Restrict messages from non-admins
    bot.sendMessage(
      chatId
      //   "Chat has been locked. Only admins can send messages."
    );

    bot.sendMessage(
      chatId,
      `➖➖➖➖➖➖➖➖➖➖➖➖➖
‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️कृपया ध्यान दें हम किसी से किसी के
पर्सनल में जाकर पेमेंट नहीं मांगते और ना कोई किसी प्रकार का ओटीपी , नाही किसी प्रकार का टेलीग्राम का एसएस और ना ही किसी को पर्सनल कॉल करते है अगर हमारे नाम से आपके पास कोई पेमेंट मांगता है तो सीधा ब्लॉक कर देना क्योंकि वह चोर है अगर आप फिर भी पेमेंट करते हो तो उसके जिम्मेदार आप खुद होंगे हम नहीं होंगे
➖➖➖➖➖➖➖➖➖➖➖➖➖
A.V.A.U ONLINE GAME CLUB
➖➖➖➖➖➖➖➖➖➖➖➖➖`
    );

    // Loop through the stored user IDs for this specific chat and restrict them
    const members = chatMembers[chatId]; // Get the set of userIds for the current chat
    if (members) {
      for (let userId of members) {
        try {
          await bot.restrictChatMember(chatId, userId, {
            can_send_messages: false, // Restrict messages from non-admin users
          });
        } catch (error) {
          console.error(`Failed to restrict user ${userId}:`, error);
        }
      }
    }
  } else {
    bot.sendMessage(chatId, "Only admins can lock the chat.");
  }
});

// Handle /unlock command (Optional: Unlock chat and allow everyone to send messages)
bot.onText("/unlock", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  console.log(`User ID: ${userId}, Chat ID: ${chatId}`);

  // Check if the user is an admin of the chat
  const admins = await bot.getChatAdministrators(chatId);
  const isAdmin = admins.some((admin) => admin.user.id === userId);

  if (isAdmin) {
    // Unlock the chat: Allow everyone to send messages
    bot.sendMessage(
      chatId
      //   "Chat has been unlocked. Everyone can send messages now."
    );

    bot.sendMessage(
      chatId,
      `➖➖➖➖➖➖➖➖➖➖➖➖➖
  ‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️कृपया ध्यान दें हम किसी से किसी के
  पर्सनल में जाकर पेमेंट नहीं मांगते और ना कोई किसी प्रकार का ओटीपी , नाही किसी प्रकार का टेलीग्राम का एसएस और ना ही किसी को पर्सनल कॉल करते है अगर हमारे नाम से आपके पास कोई पेमेंट मांगता है तो सीधा ब्लॉक कर देना क्योंकि वह चोर है अगर आप फिर भी पेमेंट करते हो तो उसके जिम्मेदार आप खुद होंगे हम नहीं होंगे
  ➖➖➖➖➖➖➖➖➖➖➖➖➖
  A.V.A.U ONLINE GAME CLUB
  ➖➖➖➖➖➖➖➖➖➖➖➖➖`
    );
    // Loop through the stored user IDs for this specific chat and unrestrict them
    const members = chatMembers[chatId]; // Get the set of userIds for the current chat
    if (members) {
      for (let userId of members) {
        try {
          await bot.restrictChatMember(chatId, userId, {
            can_send_messages: true, // Allow sending messages again
          });
        } catch (error) {
          console.error(`Failed to unrestrict user ${userId}:`, error);
        }
      }
    }
  } else {
    bot.sendMessage(chatId, "Only admins can unlock the chat.");
  }
});

bot.onText(/^(ok)$/i, (msg) => {
  const chatId = msg.chat.id;

  const okResponse = `
  Automatic ok hai

AGR APNE PAYMENT KAR DI HAI, YA APKI PAYMENT PAHLE SE JAMA HAI TO APKI GAME OK HAI❤️

🆗 अपनी गेम का टोटल चेक📝 करके गेम पोस्ट करे टोटल गलत पर आपको सिर्फ ℝ𝔼𝔽𝕌ℕ𝔻 किया जाएगा 👍`;

  bot.sendMessage(chatId, okResponse);
});

bot.onText(/^(payment|pay|भुगतान|qr|भुगतान करे|upi)$/i, (msg) => {
  const chatId = msg.chat.id;

  const paymentResponse = `सभी भुगतान संख्या पर

पेटीएम : 🔜 xxxxxxx
           

फ़ोन पे : 🔜 xxxxxxxx
          

गूगल पे :🔜 xxxxxxxx
             

भाव 10 का 950

A.V.A.U online game club

इसके आलावा आप अगर किसी और नंबर पर पेमेंट करते हैं तो उसकी जिम्मेदारी आपकी होगी

(ADMIN)

https://t.me/AVAU_ONLINE_GAME_CLUB
*
https://t.me/Payment_admin_AVAU



LIVE IN YOUR WORLD PLAY IN OURS 
                ( AVAU )`;

  bot.sendMessage(chatId, paymentResponse);
});

bot.onText(/^rules/i, (msg) => {
  const chatId = msg.chat.id;

  const rulesResponse = `: AVAU Online Game Club :

RATE : 10 ke 950 ❤️‍🔥
👉🏻(TIME TABLE)
DB : 03:00 LAST
SG : 04:30 LAST
FD : 05:50 LAST
GB : 08:50 LAST
GL : 11:25 LAST
DS : 04:00 LAST

PAYMENT NO. 💰 
*paytm
 *xxxxxxxxx
*PhonePe
*xxxxxxxxx
*Google Pay
*xxxxxxxxxx

❤️‍🔥RULES❤️‍🔥
01. टोटल ग़लत होने पर हाफ ( आदि ) पासिंग दी जाएगी आदि पासिंग तब मिलेगी जब आप बैलेंस ++ या आपकी पेमेंट पूरी होगी | अगर बैलेंस ++ नहीं हो तो सिर्फ़ रिफ़ंड होगा ।

02. ⁠क्रासिंग में विद् जोड़ा विदाउट जोड़ा क्लियर लिखा होगा चाइए । नहीं तो सिर्फ़ रिफ़ंड होगा ।

03. ⁠हरफ़ में अंदर बाहर (🆎) क्लियर लिखे । 🆎 ना लिखने पर हर्फ़ बाहर का माना जाएगा ।

04. ⁠मैसेज डिलीट करने से पहले एडमिन को बता दे । और रिजल्ट के बाद मेसेज डिलीट करने पर बैलेंस 00 हो जाएगा ।

05. ⁠एडिट मैसेज पर कोई पासिंग रिफ़ंड नहीं होगा |

06. ⁠अगर ++ से गेम खेलते है तो अपना हिसाब बना कर डाले हिसाब ना बनाने कोई गेम वैलिड नहीं होगा ।

07. ⁠फेल गेम का कोई रिफ़ंड नहीं होगा ।

08. 5 ईंटों जोड़ी और 50 ईंटों हर्फ़ वैलिड होगा । इससे कम खेलने पर आदी पासिंग दी जाएगी ।

09. एक मेसेज मे डबल जोड़ी 50 ईंटों से ज़्यादा होगी तो एक बार ही जोड़ी जायेगी । 1 फोल्डर के डबल जोड़ी की 50 इंटू तक ही पासिंग दी जाएगी ।

LIVE IN YOUR WORLD PLAY IN OURS 
                ( AVAU )

किसी भी समस्या के लिए कांटैक्ट करे ।
Telegram 

https://t.me/AVAU_ONLINE_GAME_CLUB

https://t.me/Payment_admin_AVAU`;

  bot.sendMessage(chatId, rulesResponse);
});

// bot.onText;

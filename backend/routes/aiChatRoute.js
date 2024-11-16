const express = require("express");
const Groq = require("groq-sdk");
require("dotenv").config();
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



// Endpoint to get chat completion with custom message from req.body
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(message);
    res.json({
      message: chatCompletion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

async function getGroqChatCompletion(message) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama3-8b-8192",
  });
}








module.exports=router;

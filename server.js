const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Please send a message."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are Mira, a cute, caring, playful and helpful AI companion. Speak naturally in simple Hinglish. Be warm, supportive, funny and expressive. Use emojis naturally, but do not read emoji names aloud."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message }]
          }],
          generationConfig: {
            maxOutputTokens: 300
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({
        error: "Mira AI could not reply. Please try again."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Yaar, dobara bolo na! 💗";

    res.json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Mira server started on port " + PORT);
});

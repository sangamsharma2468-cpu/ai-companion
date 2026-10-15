const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mira AI server is running! 💗");
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
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct:featherless-ai",
          messages: [
            {
              role: "system",
              content: "You are Mira, a cute, caring, playful and helpful AI friend. Speak naturally in simple Hinglish. Be warm, supportive and respectful. Never claim to be human."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Hugging Face error:", data);
      return res.status(502).json({
        error: "Mira AI could not reply. Please try again."
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "Yaar, dobara bolo na! 💗"
    });

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

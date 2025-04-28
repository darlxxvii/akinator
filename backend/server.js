import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

app.post("/api/ask", async (req, res) => {
  const { messages } = req.body;

  try {
    const openRouterMessages = [
      { role: "system", content: "Ты Акинатор. Пользователь загадывает персонажа, а ты задавай короткие, четкие вопросы чтобы угадать персонажа который пользователь загадал на 100%, на которые можно ответить 'да', 'нет' или 'не знаю'. Не торопись. Когда готов угадать — делай предположение." },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-sonnet", 
        messages: openRouterMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка OpenRouter:", errorData);
      return res.status(500).json({ success: false, error: errorData });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return res.status(500).json({ success: false, error: "Ответ ИИ пустой" });
    }

    res.json({ success: true, message: aiMessage });

  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({ success: false, error: "Ошибка при обращении к OpenRouter" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

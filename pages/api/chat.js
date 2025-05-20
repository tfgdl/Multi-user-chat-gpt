export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ No response";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error fetching from OpenAI API:", error);
    res.status(500).json({ reply: "⚠️ Error contacting GPT API." });
  }
}

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -------- Instagram Downloader --------
app.post("/download", async (req, res) => {
  const { url, audio } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "URL yo‘q" });
  }

  try {
    // Instagram oEmbed orqali ma’lumot
    const oe = await fetch(
      `https://www.instagram.com/oembed/?url=${encodeURIComponent(url)}`
    );

    if (!oe.ok) {
      return res.status(400).json({ error: "Instagram ma’lumot topilmadi" });
    }

    const data = await oe.json();

    // Ba’zan Instagram video uchun direct url qaytaradi:
    // data.thumbnail_url yoki boshqa maydonga qarang
    const videoUrl =
      data.thumbnail_url ||
      data.url ||
      data.video || // agar mavjud bo‘lsa
      null;

    if (!videoUrl) {
      return res.status(404).json({ error: "Video link topilmadi" });
    }

    // Javobni yuboramiz
    return res.json({
      title: data.title || null,
      author: data.author_name || null,
      file: videoUrl,
    });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Serverda xatolik" });
  }
});

// Ping
app.get("/", (req, res) => res.send("Instagram Downloader ishlayapti"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

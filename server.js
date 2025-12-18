import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 10000;

// Instagramdan video yoki audio olish uchun '/download' endpoint
app.use(express.json());

app.post("/download", async (req, res) => {
  const { url, audio } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  try {
    // Instagramdan media olish
    const response = await fetch(`https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.file_url) {
      const file = audio ? data.file_url.audio : data.file_url.video;
      return res.json({ file });
    } else {
      return res.status(400).json({ message: "Failed to download media." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

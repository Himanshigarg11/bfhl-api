require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "Himanshi0771.be23@chitkara.edu.in";

/* ROOT */
app.get("/", (req, res) => {
  res.status(200).json({
    is_success: true,
    message: "BFHL API is running",
    official_email: EMAIL
  });
});

/* HEALTH */
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

/* BFHL */
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key is required"
      });
    }

    const key = keys[0];
    let data;

    /* FIBONACCI */
    if (key === "fibonacci") {
      const n = body[key];
      let arr = [0, 1];
      for (let i = 2; i < n; i++) {
        arr.push(arr[i - 1] + arr[i - 2]);
      }
      data = arr.slice(0, n);
    }

    /* PRIME */
    else if (key === "prime") {
      data = body[key].filter(num => {
        if (num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      });
    }

    /* HCF */
    else if (key === "hcf") {
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      data = body[key].reduce((a, b) => gcd(a, b));
    }

    /* LCM */
   else if (key === "AI") {
  const aiRes = await axios.post(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
    {
      contents: [{ parts: [{ text: body[key] }] }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      }
    }
  );

  // single-word response as required
  data = aiRes.data.candidates[0].content.parts[0].text
    .trim()
    .split(/\s+/)[0];
}



    /* INVALID KEY */
    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Invalid key"
      });
    }

    return res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
  console.error("AI ERROR:", err.response?.data || err.message);
  return res.status(500).json({
    is_success: false,
    official_email: EMAIL,
    error: "Server error"
  });
}

});

/* SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

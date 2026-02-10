require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "Himanshi0771.be23@chitkara.edu.in";

/* ---------- HELPER FUNCTIONS ---------- */

function fibonacci(n) {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n);
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function hcf(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

function lcm(arr) {
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}

/* ---------- ROUTES ---------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});


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

    if (key === "fibonacci") {
      data = fibonacci(body[key]);
    } 
    else if (key === "prime") {
      data = body[key].filter(isPrime);
    } 
    else if (key === "hcf") {
      data = hcf(body[key]);
    } 
    else if (key === "lcm") {
      data = lcm(body[key]);
    } 
   else if (key === "AI") {
  const aiRes = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    {
      contents: [
        {
          parts: [{ text: body[key] }]
        }
      ]
    },
    {
      params: {
        key: process.env.GEMINI_API_KEY
      }
    }
  );

  data = aiRes.data.candidates[0].content.parts[0].text.trim();
}



    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Invalid key"
      });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

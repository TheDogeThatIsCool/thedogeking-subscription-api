const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = 8177;

app.use(express.json());

// In-memory "database"
const subscriptions = {};

/*
  Subscription Structure:
  {
    username: {
      subscriptionId: 'sub_xxxxxxxx',
      status: 'active',
      level: 'DOGE_GOLD' // or DOGE_SILVER, DOGE_ULTRA, DOGE_PLATINUM
    }
  }
*/

// 🔍 Get subscription by username
app.get("/subscriptions/:username", (req, res) => {
  const { username } = req.params;
  const subscription = subscriptions[username];

  if (!subscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  return res.json(subscription);
});

// ➕ Create a new subscription
app.post("/subscriptions", (req, res) => {
  const { username, status, level } = req.body;

  if (!username || !status || !level) {
    return res.status(400).json({ error: "Missing required fields: username, status, or level" });
  }

  if (subscriptions[username]) {
    return res.status(409).json({ error: "Subscription already exists for this user" });
  }

  const subscriptionId = `sub_${crypto.randomBytes(8).toString("hex")}`;

  subscriptions[username] = {
    subscriptionId,
    status,
    level
  };

  return res.status(201).json({
    message: "Subscription created",
    subscription: subscriptions[username]
  });
});

// ✏️ Update a subscription
app.put("/subscriptions/:username", (req, res) => {
  const { username } = req.params;
  const { status, level } = req.body;

  if (!subscriptions[username]) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  if (status) subscriptions[username].status = status;
  if (level) subscriptions[username].level = level;

  return res.json({ message: "Subscription updated" });
});

// ❌ Delete a subscription
app.delete("/subscriptions/:username", (req, res) => {
  const { username } = req.params;

  if (!subscriptions[username]) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  delete subscriptions[username];
  return res.json({ message: "Subscription deleted" });
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`Subscription API running at http://localhost:${PORT}`);
});

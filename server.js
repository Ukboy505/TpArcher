// server.js (Node.js example)
const webPush = require('web-push');
const express = require('express');
const app = express();

app.use(express.json());

// Your VAPID keys
const vapidKeys = {
  publicKey: 'YOUR_PUBLIC_VAPID_KEY',
  privateKey: 'YOUR_PRIVATE_VAPID_KEY'
};

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (in-memory for simplicity; use a database in production)
let subscriptions = [];

// Endpoint to receive subscriptions
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ success: true });
});

// Endpoint to send notifications (called from chart.js)
app.post('/send-notification', (req, res) => {
  const { title, body, url } = req.body;
  const payload = JSON.stringify({ title, body, url });

  const promises = subscriptions.map(subscription =>
    webPush.sendNotification(subscription, payload).catch(error => {
      console.error('Error sending notification:', error);
      // Remove invalid subscription
      subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
    })
  );

  Promise.all(promises).then(() => res.status(200).json({ success: true }));
});

app.listen(3000, () => console.log('Server running on port 3000'));
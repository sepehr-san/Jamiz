const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Path to the data file.
const dataFile = path.join(__dirname, 'data.json');

// Function to load cards from file.
function loadCardsFromFile() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading cards:', err);
  }
  return [];
}

// Function to save cards to file.
function saveCardsToFile(cards) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(cards, null, 2));
  } catch (err) {
    console.error('Error saving cards:', err);
  }
}

// Use persistent storage for cards.
let cards = loadCardsFromFile();

// Middleware to parse JSON requests.
app.use(express.json());
// Serve static files from the "public" directory.
app.use(express.static('public'));

// Endpoint to get the current cards.
app.get('/cards', (req, res) => {
  res.json(cards);
});

// Endpoint to add a new card.
app.post('/cards', (req, res) => {
  const { name, note } = req.body;
  if (!name || !note) {
    return res.status(400).json({ error: 'Both name and note are required.' });
  }
  
  const newCard = { name, note, createdAt: new Date() };
  // Add the new card to the beginning.
  cards.unshift(newCard);
  
  // Keep only the latest 25 cards.
  if (cards.length > 25) {
    cards = cards.slice(0, 25);
  }
  
  // Save the updated cards array to file.
  saveCardsToFile(cards);
  res.json({ success: true, card: newCard });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

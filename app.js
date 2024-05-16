const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Provide anime data
app.get('/animeList', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle search by title request
app.get('/search', (req, res) => {
  const searchTerm = req.query.searchTerm.toLowerCase();
  let hasMatch = false;

  fs.createReadStream('db/AnimeList.csv')
    .pipe(csv())
    .on('data', (data) => {
      const { anime_id, title, score, image_url, genre, opening_theme, ending_theme } = data;
      if (title.toLowerCase().includes(searchTerm)) {
        hasMatch = true;
        res.write(`<tr><td>${anime_id}</td><td>${title}</td><td>${score}</td><td><a class="image-link" href="${image_url}" target="_blank">${image_url}</a></td><td>${genre}</td><td>${opening_theme}</td><td>${ending_theme}</td></tr>`);
      }
    })
    .on('end', () => {
      if (!hasMatch) {
        res.write('No data is present.');
      }
      res.end();
    });
});

// Handle search by ID request
app.get('/searchByID', (req, res) => {
  const searchID = req.query.searchID.toLowerCase();
  let found = false;

  fs.createReadStream('db/AnimeList.csv')
    .pipe(csv())
    .on('data', (data) => {
      const { anime_id, title, score, image_url, genre, opening_theme, ending_theme } = data;
      if (anime_id.toLowerCase() === searchID) {
        found = true;
        res.write(`<tr><td>${anime_id}</td><td>${title}</td><td>${score}</td><td><a class="image-link" href="${image_url}" target="_blank">${image_url}</a></td><td>${genre}</td><td>${opening_theme}</td><td>${ending_theme}</td></tr>`);
      }
    })
    .on('end', () => {
      if (!found) {
        res.write('No data is present.');
      }
      res.end();
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

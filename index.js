const express = require('express');
const app = express();

// Aplikasi utama yang berjalan di lokal untuk testing (jika diperlukan)
app.get('/', (req, res) => {
    res.send('Welcome to the Level Image Generator API!');
});


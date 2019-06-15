const express = require('express');
const path = require('path');

const app = express();

// Init static folder
app.use(express.static(path.join(__dirname, 'public')));

// BCR API routes
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
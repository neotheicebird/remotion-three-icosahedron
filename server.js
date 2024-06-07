const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'path/to/your/file.mp4');
  res.download(file);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// src/server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const XLSX = require('xlsx');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(fileUpload());
app.get('/', (req, res) => res.send('Hello world!'));

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const workbook = XLSX.read(file.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Validate for missing rows (example validation)
  const invalidRecords = data.filter((record) => {
    return !record.college_name || !record.university || !record.Email;
  });

  if (invalidRecords.length > 0) {
    return res.status(400).json({ error: 'Invalid records found.', invalidRecords });
  }

  return res.status(200).json({ message: 'File uploaded and validated successfully.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

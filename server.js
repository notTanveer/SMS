const express = require('express');
const Outerbase = require('outerbase');
const xlsx = require('xlsx'); // Add this for Excel file uploads
const mongoose = require('mongoose');
const app = express();
const db = new Outerbase('mongodb://localhost:27017/school');

const port = process.env.PORT || 3000;

// Endpoint to upload Excel data
app.post('/upload-students', (req, res) => {
    const file = req.files.file; // Assuming you use a file upload middleware
    const workbook = xlsx.readFile(file.tempFilePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet
    const data = xlsx.utils.sheet_to_json(sheet);
  
    // Insert data into the Students collection
    data.forEach((student) => {
      const { name, grade, courses } = student;
      addStudent(name, grade, courses);
    });
  
    res.send('Data uploaded successfully');
  });  

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware setup
app.use(express.json());
app.use(fileUpload()); // Middleware for file uploads

// Include your API routes here
const studentRoutes = require('./app/routes/studentRoutes');
const courseRoutes = require('./app/routes/courseRoutes');

app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

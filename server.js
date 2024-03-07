const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Serve static files from the current directory
app.use(express.static(__dirname));

// Dummy data for demonstration purposes
let members = [];

// Route to add a new member
app.post('/api/members', upload.single('image'), (req, res) => {
    // Handle member creation
    console.log(req.body);
    console.log(req.file);
    
    const { firstName, lastName, dob } = req.body;

    // Format date of birth
    const dateOfBirth = new Date(dob).toLocaleDateString('en-US');

    // Add the new member to the list
    members.push({ firstName, lastName, dateOfBirth, imageUrl: req.file.filename });
    res.status(200).json({ message: 'Member added successfully' });
});

// Route to get all members
app.get('/api/members', (req, res) => {
    res.json(members);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

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
    console.log('Request Body:', req.body); // Log the entire request body
    console.log('Date of Birth:', req.body.dob); // Log the value of the date field

    const { firstName, lastName, dob, gender, tel, email, maritalStatus, location, occupation } = req.body;

    // Format date of birth
    const dateOfBirth = new Date(dob).toLocaleDateString('en-US');

    // Add the new member to the list
    members.push({ 
        id: Date.now().toString(), 
        firstName, 
        lastName, 
        dateOfBirth, 
        gender,
        tel,
        email,
        maritalStatus,
        location,
        occupation,
        imageUrl: req.file.filename 
    });

    res.status(200).json({ message: 'Member added successfully' });
});

// Route to get all members
app.get('/api/members', (req, res) => {
    res.json(members);
});

// Route to delete a member
app.delete('/api/members/:id', (req, res) => {
    const memberId = req.params.id;

    // Find the index of the member with the given ID
    const index = members.findIndex(member => member.id === memberId);
    if (index !== -1) {
        // Remove the member from the array
        members.splice(index, 1);
        res.status(200).json({ message: 'Member deleted successfully' });
    } else {
        // If member not found, return 404 Not Found status
        res.status(404).json({ error: 'Member not found' });
    }
});

// Route to update member details
app.put('/api/members/:id', upload.single('image'), (req, res) => {
    const memberId = req.params.id;

    const index = members.findIndex(member => member.id === memberId);
    if (index !== -1) {
        // Update member details
        members[index] = { 
            ...members[index],
            ...req.body,
            imageUrl: req.file ? req.file.filename : members[index].imageUrl // Update image if provided
        };
        res.status(200).json({ message: 'Member details updated successfully' });
    } else {
        res.status(404).json({ error: 'Member not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Path to responses file
const RESPONSES_FILE = path.join(__dirname, 'contact_responses.txt');

// Ensure responses file exists
if (!fs.existsSync(RESPONSES_FILE)) {
    fs.writeFileSync(RESPONSES_FILE, 'Contact Form Responses\n=====================\n\n', 'utf8');
}

// Route to handle contact form submissions
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        const timestamp = new Date().toLocaleString();
        const responseId = Date.now();

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Format the response data
        const responseData = `\n--- New Contact Form Submission ---\n`;
        const responseContent = `Response ID: ${responseId}\n` +
                               `Date & Time: ${timestamp}\n` +
                               `Name: ${name}\n` +
                               `Email: ${email}\n` +
                               `Message: ${message}\n` +
                               `----------------------------------\n`;

        // Append to file
        fs.appendFileSync(RESPONSES_FILE, responseData + responseContent, 'utf8');

        console.log(`New contact form submission saved. ID: ${responseId}`);

        res.json({
            success: true,
            message: 'Message sent successfully! Response has been saved.',
            responseId: responseId
        });

    } catch (error) {
        console.error('Error saving contact form response:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save message. Please try again.'
        });
    }
});

// Route to get all responses (admin access)
app.get('/api/responses', (req, res) => {
    try {
        if (fs.existsSync(RESPONSES_FILE)) {
            const content = fs.readFileSync(RESPONSES_FILE, 'utf8');
            res.type('text/plain').send(content);
        } else {
            res.status(404).send('No responses file found');
        }
    } catch (error) {
        console.error('Error reading responses file:', error);
        res.status(500).send('Error reading responses');
    }
});

// Route to download responses file
app.get('/api/download-responses', (req, res) => {
    try {
        if (fs.existsSync(RESPONSES_FILE)) {
            res.download(RESPONSES_FILE, 'contact_responses.txt');
        } else {
            res.status(404).send('No responses file found');
        }
    } catch (error) {
        console.error('Error downloading responses file:', error);
        res.status(500).send('Error downloading file');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Contact responses will be saved to: ${RESPONSES_FILE}`);
});
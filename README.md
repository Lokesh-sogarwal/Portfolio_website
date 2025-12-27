# Portfolio Website

A modern, responsive portfolio website with contact form functionality that saves responses to a text file.

## Features

- Fully responsive design for all devices
- Animated contact form with validation
- Server-side form response saving
- Admin endpoints for viewing/downloading responses
- Modern UI with smooth animations

## Setup and Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. Open `http://localhost:3000` in your browser.

## Contact Form Functionality

### How It Works

1. **Form Submission**: Users fill out the contact form and submit it
2. **Server Processing**: The server receives the form data via POST to `/api/contact`
3. **File Storage**: Responses are automatically appended to `contact_responses.txt`
4. **Response**: User receives confirmation that their message was saved

### Response File Format

Each submission is saved in the following format:

```
--- New Contact Form Submission ---
Response ID: 1703659200000
Date & Time: 12/27/2023, 10:00:00 AM
Name: John Doe
Email: john@example.com
Message: Hello, I found your portfolio interesting!
----------------------------------
```

### Admin Endpoints

#### View All Responses
```
GET /api/responses
```
Returns the entire content of the responses file as plain text.

#### Download Responses File
```
GET /api/download-responses
```
Downloads the `contact_responses.txt` file directly.

### File Location

The responses are saved to `contact_responses.txt` in the root directory of the project. The file is created automatically if it doesn't exist.

## Project Structure

```
portfolio-website/
├── index.html          # Main HTML file
├── style.css           # Stylesheets
├── script.js           # Client-side JavaScript
├── server.js           # Node.js server
├── package.json        # Dependencies
├── contact_responses.txt # Auto-generated responses file
└── README.md          # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Animations**: Anime.js
- **Icons**: Font Awesome

## Responsive Design

The website is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## Customization

### Styling
Edit `style.css` to customize the appearance.

### Form Fields
Modify the form in `index.html` and update the server validation in `server.js` accordingly.

### Server Configuration
Change the port or other server settings in `server.js`.

## Troubleshooting

### Server Won't Start
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available

### Form Submissions Not Saving
- Check server console for error messages
- Verify file permissions for writing to the directory
- Check if `contact_responses.txt` exists and is writable

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3000 to another port
```

## License

MIT License - feel free to use this project for your own portfolio!

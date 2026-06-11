// Import Express framework
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 3000; // Port number where server will listen

// Serve static files from the current directory
// This means Express will automatically serve any .html, .js, .css files
app.use(express.static(__dirname));

// Optional: Explicitly handle the root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🎮 Connect Four server is running!`);
    console.log(`📍 Open your browser and visit: http://localhost:${PORT}`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

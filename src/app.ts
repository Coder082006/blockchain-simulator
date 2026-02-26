import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { setupRoutes } from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// API body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Redirect root to visualizer
app.get('/', (req, res) => {
    res.redirect('/visualizer.html');
});

// Serve static frontend from public (resolve from project root)
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

// Wire API routes
setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
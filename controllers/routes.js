import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Added these lines to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse sneaker data once when the module loads
const sneakerDataPath = path.resolve(__dirname, '../sneaker_data.json');
let sneakerData = [];
try {
	const sneakerDataRaw = fs.readFileSync(sneakerDataPath, 'utf8');
	sneakerData = JSON.parse(sneakerDataRaw);
	console.log('Sneaker data loaded successfully.');
} catch (err) {
	console.error('Error reading or parsing sneaker_data.json:', err);
	// Handle the error appropriately, maybe set sneakerData to empty or throw
}

const ensureAuthenticated = (req, res, next) => {
	return req.isAuthenticated() ? next() : res.sendStatus(401);
};

// const isAdminRoute = (req, res, next) => {
// 	return req.user.isAdmin
// 		? next()
// 		: res.status(403).send({ code: 'not_allowed' });
// };

const initRoutes = (app) => {
	// Create API router with base path
	const apiRouter = express.Router();
	app.use('/api', apiRouter);

	// Add the new GET route for sneakers
	apiRouter.get('/sneakers', (req, res) => {
		res.status(200).json({
			data: sneakerData,
		});
	});

	// ... potentially other routes ...
};

export { initRoutes };

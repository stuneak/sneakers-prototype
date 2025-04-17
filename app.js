import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import path from 'path';
import { createServer } from 'http';
import './models/index.js';
// import { Feature } from './models/index.js';

// import * as db from './db/connect.js';
import { initRoutes } from './controllers/routes.js';
// import { initServer, initConnection } from './websocket.js';
// import { getTemporarySignedUrl } from './external/bucket.js';

// import SequelizeStoreFactory from 'connect-session-sequelize';
// const SequelizeStore = SequelizeStoreFactory(session.Store);
import { fileURLToPath } from 'url';

const isProd = process.env.BACKEND_ENV === 'prod';
const PROD_VPS_IP = process.env.PROD_VPS_IP;

const app = express();
const httpServer = createServer(app);

// // Create session store
// const sessionStore = new SequelizeStore({
// 	db: db.sequelize,
// 	tableName: 'sessions',
// });

// const sessionMiddleware = session({
// 	name: 'ssid',
// 	// store: sessionStore,
// 	cookie: {
// 		httpOnly: false, // isProd
// 		secure: false, // isProd
// 		maxAge: 1000 * 60 * 60 * 24 * 180,
// 	},
// 	proxy: false, // isProd
// 	secret: process.env.SESSION_SECRET,
// 	resave: true,
// 	saveUninitialized: false,
// });

// if (isProd) {
// 	app.use(
// 		cors({
// 			origin: 'https://domain.com',
// 			credentials: true,
// 		})
// 	);
// } else {
// 	app.use(cors());
// }

// initServer(httpServer);

// if (isProd) {
// 	app.set('trust proxy', (ip) => {
// 		if (ip === '127.0.0.1' || ip === PROD_VPS_IP) return true; // trusted IPs
// 		else return false;
// 	});
// }

// configure the app to use bodyParser()
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());

// Handle images domain requests
app.use(async (req, res, next) => {
	const host = req.hostname;
	const imagesDomain = isProd ? 'image.domain.com' : 'image.localhost';

	if (host === imagesDomain) {
		// Redirect all requests from the images domain to /file path
		const presignedUrl = await getTemporarySignedUrl(req.url);
		return res.redirect(presignedUrl);
	}
	next();
});

//Add this before the app.get() block
//initConnection();
initRoutes(app);

// Add these lines to create equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (true) {
	//
	app.use(
		express.static(path.join(__dirname, 'client/dist'), {
			maxAge: '1d',
			setHeaders: (res, filePath) => {
				if (path.basename(filePath) === 'index.html') {
					// Disable caching for index.html
					res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
					res.set('Pragma', 'no-cache');
					res.set('Expires', '0');
				} else {
					// Cache other static assets
					res.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 1}`);
				}
			},
		})
	);

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
	});
}

const port = process.env.PORT || 3000;

const createDefaultFeature = async () => {
	// try {
	// 	const feature = await Feature.findOne();
	// 	if (!feature) {
	// 		const newFeature = await Feature.create({
	// 			test: true,
	// 		});
	// 		console.log('New feature created:', newFeature.toJSON());
	// 		return newFeature;
	// 	}
	// 	return feature;
	// } catch (error) {
	// 	console.error('Error creating feature:', error);
	// }
};

const start = async () => {
	try {
		// await db.initialize();
		//await createDefaultFeature();

		httpServer.listen(port, () => {
			console.log('Server listening on port ' + port);
		});
	} catch (error) {
		console.log(error);
	}
};

start();

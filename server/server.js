import express from 'express'; //web framework for node.js to create API's, handle routes( POST, GET)
import cors from 'cors'; //allowed backend API to be accessed from different frontend domain
import 'dotenv/config'; //let you store secret keys, database URL in a .env files
import cookieParser from 'cookie-parser'; //helps to send the cookies in the API response

import connectDB from './config/mongodb.js';
import router from './routes/authRoutes.js';
import userData from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Read allowed origins from environment (comma-separated) or fall back to localhost + your Vercel frontend
const rawAllowedOrigins =
    process.env.ALLOWED_ORIGINS ||
    'http://localhost:5173,https://authentication-system-sigma-six.vercel.app';

const allowedOrigins = rawAllowedOrigins
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (origin.endsWith('.vercel.app')) return true;
    if (origin.endsWith('.onrender.com')) return true;
    return false;
};

app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

app.get('/', (req, res) => res.send("API Is Working")); //GET used to retrieve data from a server.
app.use('/api/auth', router);
app.use('/api/user', userData);

app.listen(port, () => console.log(`Server is running on: ${port}`));
console.log("Mongo URI:", process.env.MONGODB_URI);

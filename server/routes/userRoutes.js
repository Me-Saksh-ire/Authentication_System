import express from 'express';
import userAuth from "../middleware/userAuth.js";
import { getUserData } from '../controllers/userController.js';

const userData = express.Router();

userData.get('/data', userAuth, getUserData);

export default userData;
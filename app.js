import express, { json } from "express";
import firebaseAdmin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';

import clientHandler from "./src/handlers/clientHandlerRoute.js";
import accessHandler from "./src/handlers/accessHandlerRoute.js";
import { getAllClientIds } from "./src/utils/dbHelper.js";
import { knowledgeCron } from "./src/utils/knowledgeCron.js";

// Express props
const app = express();
app.use(json());


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Initialize Firebase
const firebaseApp = initializeApp({
    credential: firebaseAdmin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
});

// Initialize Firestore
const db = getFirestore();

// Cron Job
knowledgeCron();

// Custom Routes
app.use("/client", clientHandler);
app.use("/auth", accessHandler);
app.use("/test", async (req, res) => {
    await getAllClientIds();
    res.status(200).send("Server is running");
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
});

export { db, firebaseApp }
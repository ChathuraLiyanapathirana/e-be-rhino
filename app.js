import express, { json } from "express";
const app = express();
app.use(json());

import clientHandler from "./src/handlers/clientHandler.js";

app.use("/client", clientHandler);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
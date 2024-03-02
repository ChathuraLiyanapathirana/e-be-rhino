const express = require("express");
const { json } = require("express");
const clientHandler = require("./src/handlers/clientHandler.js");

const app = express();
app.use(json());

app.use("/client", clientHandler);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

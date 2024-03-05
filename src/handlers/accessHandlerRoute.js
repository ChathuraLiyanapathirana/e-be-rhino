import { Router } from "express";

import { makeClientIdentity } from "../utils/dbHelper.js";

const router = Router();

router.post("/access", async (req, res) => {
    console.error("access init");
    const nToken = req.body.nToken;
    const clientId = req.body.clientId;

    if (!nToken || !clientId) {
        res.status(400).send("Please provide request params in the request body.");
        return;
    }

    try {
        const identity = await makeClientIdentity(clientId, nToken);

        if (identity) {
            res.status(200).json({
                data: {
                    id: identity
                }
            });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Access/ Error: ", error);
        res.status(500).json({ error: response.error });
    }

});

export default router;
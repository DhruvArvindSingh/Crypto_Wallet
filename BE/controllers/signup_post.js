import client from "../database/index.js";

export default async function signup_post(req, res) {
    console.log("POST /signup received");
    console.log("Request body:", req.body); // Debug logging

    if (!req.body) {
        console.error("Request body is undefined");
        return res.status(400).json({ process_status: "Failed", error: "No request body provided" });
    }

    const { email, password } = req.body || {};

    if ( !email || !password) {
        console.error("Missing required fields:", { email, password });
        return res.status(400).json({
            process_status: "Failed",
            error: "Missing required fields (email, or password)"
        });
    }

    try {
        // Insert user into the database
        const user = await client.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, password]
        );

        console.log("Signup successful for:", user.rows[0]);
        return res.status(200).json({ process_status: "Success" });
    } catch (e) {
        console.error("An error occurred during signup:", e);
        return res.status(400).json({ process_status: "Failed", error: e.message });
    }
}

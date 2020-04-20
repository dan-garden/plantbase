const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/register", async (req, res) => {
        try {
            const result = await plantbase.registerUser(req);
            res.json({
                success: result
            });
        } catch(e) {
            console.log(e);
            res.json({ error: e.message })
        }
    });
}
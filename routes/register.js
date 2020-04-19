const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/register", async (req, res) => {
        try {
            const result = await plantbase.registerUser(req.body.username, req.body.password, req.body.passwordRepeat)
            res.json({
                success: result
            });
        } catch(e) {
            res.json({ error: e.message })
        }
    });
}
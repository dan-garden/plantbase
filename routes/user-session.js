const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.get("/api/session", async (req, res) => {
        try {
            const session = await plantbase.getUserSession(req);
            res.json({ session });
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
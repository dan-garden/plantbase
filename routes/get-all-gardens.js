const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.get("/api/get-all-gardens", async (req, res) => {
        try {
            const result = await plantbase.getGardens();
            res.json(result);
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
const trefle = require("../providers/Trefle");

module.exports = function(app) {
    app.get("/api/search-plant/:query", async (req, res) => {
        try {
            if(req.params.query) {
                const result = await trefle.searchPlants(req.params.query);
                res.json({ success: result });
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
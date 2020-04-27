const trefle = require("../providers/Trefle");

module.exports = function(app) {
    app.get("/api/get-indexed-plant/:id", async (req, res) => {
        try {
            if(req.params.id) {
                const result = await trefle.getPlant(req.params.id);
                res.json(result);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.get("/api/get-garden/:garden_id", async (req, res) => {
        try {
            if(req.params.garden_id) {
                const result = await plantbase.getGardenById(req.params.garden_id);
                res.json(result);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
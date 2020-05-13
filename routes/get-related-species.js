const plantbase = require("../providers/Plantbase");
const apicache = require("apicache");
const cache = apicache.middleware;

module.exports = function (app) {
    app.get("/api/get-related-species/:plant_id", cache('10 minutes'), async (req, res) => {
        try {
            if (req.params.plant_id) {
                const result = await plantbase.getRelatedSpecies(req.params.plant_id);
                res.json({
                    success: result
                });
            }
        } catch (e) {
            console.error(e);
            res.json({
                error: e.message
            })
        }
    });
}
const plantbase = require("../providers/Plantbase");

module.exports = function (app) {
    app.get("/api/get-related-species/:plant_id", async (req, res) => {
        try {
            if (req.params.plant_id) {
                const result = plantbase.getRelatedSpecies(req.params.plant_id);
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
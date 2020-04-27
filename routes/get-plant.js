const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.get("/api/get-plant/:plant_id", async (req, res) => {
        try {
            if(req.params.plant_id) {
                const result = await plantbase.getPlantById(req.params.plant_id);
                res.json(result);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
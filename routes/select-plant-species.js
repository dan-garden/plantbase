const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/select-plant-species", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.selectPlantSpecies(req.body.plant_id, req.body.species_id);
            res.json({ success: result });
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
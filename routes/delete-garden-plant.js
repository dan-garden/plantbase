const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/delete-garden-plant", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.deletePlantFromGarden(req.user, req.body.plant_id);
            res.json({ success: result });
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
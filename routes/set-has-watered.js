const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/set-has-watered", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.setHasWatered(req.user._id, req.body.plant_id, true);
            res.json({ success: result });
        } catch(e) {
            res.json({ error: e.message })
        }
    });
}
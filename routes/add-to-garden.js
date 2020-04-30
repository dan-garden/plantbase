const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/add-to-garden", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.addTypeToGarden(req.user._id, req.body.garden_id, req.body.slug);
            res.json({ success: result });
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
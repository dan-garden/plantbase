const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/create-garden", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.createGarden(req.user._id, req.body.name, req.body.description);
            res.json({ success: result });
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
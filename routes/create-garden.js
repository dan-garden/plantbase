const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/create-garden", async (req, res) => {
        try {
            if(req.body.name) {
                const result = await plantbase.createGarden(req.params.name);
                res.json(result);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
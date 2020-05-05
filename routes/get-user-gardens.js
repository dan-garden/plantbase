const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.get("/api/get-user-gardens/:user_id", async (req, res) => {
        try {
            if(req.params.user_id) {
                const result = await plantbase.getGardensByUserId(req.params.user_id);
                res.json({
                    success: result
                });
            }
        } catch(e) {
            res.json({ error: e.message })
        }
    });
}
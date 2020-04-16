const almanac = require("../providers/Almanac");

module.exports = function(app) {
    app.get("/api/get-type/:slug", async (req, res) => {
        try {
            if(req.params.slug) {
                const result = await almanac.getType(req.params.slug);
                res.json(result);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
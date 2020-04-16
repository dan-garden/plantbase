const almanac = require("../providers/Almanac");

module.exports = function(app) {
    app.get("/api/search-type/:query", async (req, res) => {
        try {
            if(req.params.query) {
                const search_results = await almanac.searchTypes(req.params.query);
                res.json(search_results);
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}
const express = require("express");
const app = express();


const port = 3001;


const trefle = require("./providers/Trefle");
const almanac = require("./providers/Almanac");
const plantbase = require("./providers/Plantbase");
const garden = require("./garden");


require("./routes/index")(app);

app.get("/api/search/:query", async (req, res) => {
    try {
        if(req.params.query) {
            const search_results = await almanac.searchTypes(req.params.query);
            res.json(search_results);
        } else {
            res.json({ error: "Search query not defined." })
        }
    } catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

app.get("/api/plant/:slug", async (req, res) => {
    try {
        if(req.params.slug) {
            const plant_data = await almanac.getType(req.params.slug);
            const count = await garden.getCount(plant_data.slug);
            plant_data.count = count;
            res.json(plant_data);
        } else {
            res.json({ error: "Plant slug not defined." })
        }
    } catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

app.get("/api/garden", async (req, res) => {
    try {
        const plants = await garden.getAll();
        res.json(plants);
    } catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

app.get("/api/add-plant/:slug", async (req, res) => {
    try {
        if(req.params.slug) {
            const db = await garden.add(req.params.slug);
            res.json({ success: "Plant was added to garden." });
        } else {
            res.json({ error: "Plant slug not defined." })
        }
    } catch(e) {
        console.error(e);
        res.json({ error: e.message })
    }
});


app.listen(port);
console.log("App started on port " + port);
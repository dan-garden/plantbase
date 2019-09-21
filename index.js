const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const express = require("express");
const trefle = require("./trefle");
const almanac = require("./almanac");
const garden = require("./garden");
const app = express();
const port = 3000;
const delay = 0;

app.use('/', express.static('public'));


// app.get("/api/trefle/*", async (req, res) => {
//     try {
//         const api = await trefle(req.url);
//         res.json(api);
//     } catch(e) {
//         console.log(e);
//     }
// });


app.get("/api/search/:query", async (req, res) => {
    await sleep(delay);
    try {
        if(req.params.query) {
            const search_results = await almanac.searchPlant(req.params.query);
            res.json(search_results);
        } else {
            res.json({ error: "Searh query not defined." })
        }
    } catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

app.get("/api/plant/:slug", async (req, res) => {
    await sleep(delay);
    try {
        if(req.params.slug) {
            const plant_data = await almanac.getPlant(req.params.slug);
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
    await sleep(delay);
    try {
        const plants = await garden.getAll();
        res.json(plants);
    } catch(e) {
        console.error(e);
        res.json({ error: e.message });
    }
});

app.get("/api/add-plant/:slug", async (req, res) => {
    await sleep(delay);
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
})


app.listen(port);
console.log("App started on port " + port);
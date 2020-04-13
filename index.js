const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const express = require("express");
const trefle = require("./providers/Trefle");
const multer  = require('multer');
const almanac = require("./providers/Almanac");
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
            const search_results = await almanac.searchTypes(req.params.query);
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
});

const fileUploads = multer.diskStorage({
    destination: './public/assets/images/plants',
    filename: (req, file, callback) => {
        let ext = false;
        switch (file.mimetype) {
            case 'image/jpeg':
                ext = "jpg";
                break;
            case 'image/png':
                ext = "png";
                break;
            case 'image/gif':
                ext = "gif";
        }

        if(ext) {
            let filename = Date.now() + "." + ext;
            callback(null, filename);
        } else {
            callback("Invalid Filetype");
        }
    }
});

const upload = multer({ storage: fileUploads }).single('photo');

app.post('/api/plant-photo-upload', async (req, res, next) => {
    await upload(req, res, async (err) => {
        await garden.update(req.body.id, {
            photo: req.file.filename
        });
        return res.json({
            success: "Photo was uploaded.",
            src: garden.photos_dir + "/" + req.file.filename
        });
    });
})


app.listen(port);
console.log("App started on port " + port);
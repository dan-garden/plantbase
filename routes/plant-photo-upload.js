const multer  = require('multer');
const garden = require("../garden");
const plantbase = require("../providers/Plantbase");

const fileUploads = multer.diskStorage({
    destination: './temp',
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




module.exports = function(app) {
    app.post('/api/plant-photo-upload', async (req, res, next) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            await upload(req, res, async (err) => {
                if(req.file) {
                    req.file.path = __dirname + "/../" + req.file.path;
                }
                const result = await plantbase.updatePlantPhoto(req);
                res.json({
                    success: "Photo was uploaded.",
                    src: result                
                });
            });
            

            // await upload(req, res, async (err) => {
            //     await plantbase.updatePlantPhoto(req.body.plant_id, req.file.filename);
            //     return res.json({
            //         success: "Photo was uploaded.",
            //         src: plantbase.photos_dir + "/" + req.file.filename
            //     });
            // });
        } catch(e) {
            res.json({
                error: e.message
            })
        }
    })
}
const multer  = require('multer');
const garden = require("../garden");
const plantbase = require("../providers/Plantbase");

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




module.exports = function(app) {
    app.post('/api/plant-photo-upload', async (req, res, next) => {
        await upload(req, res, async (err) => {
            await garden.update(req.plant_id, req.file.filename);
            return res.json({
                success: "Photo was uploaded.",
                src: plantbase.photos_dir + "/" + req.file.filename
            });
        });
    })
}
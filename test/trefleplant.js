const args = require("./args");
const trefle = require("../providers/Trefle");

if(args.length) {
    trefle.getPlant(args[0]).then(result => {
        console.log(result);
        process.exit();
    });
}
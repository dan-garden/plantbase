const args = require("./args");
const trefle = require("../providers/Trefle");

if(args.length) {
    trefle.getSearchedPlant(args[0]).then(result => {
        console.log(result);
        process.exit();
    });
}
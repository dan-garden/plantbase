const args = require("./args");
const trefle = require("../providers/Trefle");

if(args.length) {
    trefle.bulkSearch(args[0]).then(() => {
        process.exit();
    });
}
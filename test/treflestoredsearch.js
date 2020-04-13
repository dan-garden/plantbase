const args = require("./args");
const trefle = require("../providers/Trefle");

if(args.length) {
    trefle.getStoredSearch(args[0]).then(console.log);
}
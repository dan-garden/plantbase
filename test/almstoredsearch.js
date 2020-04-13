const args = require("./args");
const almanac = require("../providers/Almanac");


if(args.length) {
    almanac.getStoredSearch(args[0]).then(console.log);
}
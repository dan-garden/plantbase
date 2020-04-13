const args = require("./args");
const almanac = require("../providers/Almanac");

if(args.length) {
    almanac.bulkSearch(args[0]).then(() => {
        process.exit();
    });
}
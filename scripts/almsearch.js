const args = require("./args");
const almanac = require("../providers/Almanac");


if(args.length) {
    almanac.searchTypes(args[0]).then(result => {
        console.log(result);
        process.exit();
    });
}
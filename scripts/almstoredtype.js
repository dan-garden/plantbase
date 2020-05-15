const args = require("./args");
const almanac = require("../providers/Almanac");


if(args.length) {
    almanac.getStoredType(args[0]).then(result => {
        console.log(result);
        process.exit();
    });
}
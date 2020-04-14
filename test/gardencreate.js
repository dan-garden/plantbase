const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.createGarden("5e95a3088090f025b93ee112", args.join(" ")).then(result => {
        console.log(result);
        process.exit();
    })
}
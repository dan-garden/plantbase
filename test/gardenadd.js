const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.addTypeToGarden("5e95a3088090f025b93ee112", "5e95b9bf4cf3d57f09062e4c", args[0]).then(result => {
        console.log(result);
        process.exit();
    })
}
const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.getAllPlants().then(plants => {
        plantbase.selectPlantSpecies(plants[0]._id, args[0]).then(result => {
            // console.log(result);
            process.exit();
        })
    });
}
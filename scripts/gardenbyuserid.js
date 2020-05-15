const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.getGardensByUserId(args[0]).then(result => {
        console.log(result);
        process.exit();
    })
} else {
    plantbase.getUsers().then(users => {
        const user = users[0];
        plantbase.getGardensByUserId(user._id).then(result => {
            console.log(result);
            process.exit();
        });
    })
}
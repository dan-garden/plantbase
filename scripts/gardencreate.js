const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.getUsers().then(users => {
        const user = users[0];
        plantbase.createGarden(user._id, args.join(" "), "[system generated]").then(result => {
            console.log(result);
            process.exit();
        })
    })
}
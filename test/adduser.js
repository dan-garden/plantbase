const Model = require("../Database");
const PlantProvider = require("../providers/PlantProvider");

PlantProvider.store(Model.User, "email", {
    email: "dangarden@gmail.com",
    username: "Daniel",
    password: "daniel123"
}).then(result => {
    console.log(result);
    process.exit();
});
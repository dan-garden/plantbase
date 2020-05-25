const args = require("./args");
const plantbase = require("../providers/Plantbase");
const user_id = "5eaa7c4a2187d611f4beea77";

plantbase.getNotifications(user_id, args[0] ? parseInt(args[0]) : 10).then(result => {
    console.log(result);
    process.exit();
});
const PlantProvider = require("./PlantProvider");
const {
    Model,
    passport
} = require("../Database");

const almanac = require("./Almanac");
const trefle = require("./Trefle");

const validator = require('validator');

class Plantbase extends PlantProvider {
    static photos_dir = "../assets/images/plants";

    static async createGarden(user_id, name, description) {
        if (!user_id) {
            throw new Error("Invalid User");
        } else if (!name) {
            throw new Error("Please enter a garden name");
        } else if (!description) {
            throw new Error("Please enter a garden description");
        }
        const garden = {
            user_id,
            name,
            description,
            plants: []
        };
        const store = await this.store(Model.Garden, null, garden);
        return store;
    }

    static async registerUser(req) {
        if (!req.body.email || !validator.isEmail(req.body.email)) {
            throw new Error("Email address is not valid");
        } else if (!req.body.username) {
            throw new Error("Please enter a username");
        } else if (!req.body.password) {
            throw new Error("Please enter a password");
        } else if (req.body.password !== req.body.passwordRepeat) {
            throw new Error("Passwords don't match")
        }

        const newUser = await Model.User.register({
            email: req.body.email,
            username: req.body.username,
            ip: req.clientIp,
        }, req.body.password);
        return await this.loginUser(req);
    }

    static async isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }

    static async isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/my-gardens");
    }

    static async authenticateUser(username, password) {
        if (!username) {
            throw new Error("Please enter a username");
        } else if (!password) {
            throw new Error("Please enter a password");
        }
        const result = await Model.User.authenticate()(username, password);
        return result;
    }

    static async loginUser(req) {
        if (!req.body.username) {
            throw new Error("Please enter a username");
        } else if (!req.body.password) {
            throw new Error("Please enter a password");
        }

        return new Promise(async (resolve) => {
            const result = await Model.User.authenticate()(req.body.username, req.body.password);

            if (!result.user) {
                throw new Error("Username or password is incorrect");
            }

            req.login(result.user, (err) => {
                if (err) {
                    console.log(err);
                    throw new Error("User could not be logged in");
                } else {
                    resolve(req.user);
                }
            });
        })
    }

    static async getUserById(user_id) {
        const stored = await this.findOne(Model.User, {
            _id: user_id
        });

        if (stored) {
            delete stored.salt;
            delete stored.hash;
        }

        return stored;
    }

    static async getUsers() {
        const stored = await this.find(Model.User);

        return stored;
    }

    static async getGardens() {
        const stored = await this.find(Model.Garden, null, ['plants', , {
            field: 'user_id',
            email: 0,
            __v: 0,
            ip: 0
        }]);

        return stored;
    }

    static async getGardenById(garden_id) {
        let stored = await this.findOne(Model.Garden, {
            _id: garden_id
        }, ['plants', {
            field: 'user_id',
            email: 0,
            __v: 0,
            ip: 0
        }])

        return stored;
    }

    static async getGardensByUserId(user_id) {
        const stored = await this.find(Model.Garden, {
            user_id
        }, ['plants', , {
            field: 'user_id',
            email: 0,
            __v: 0,
            ip: 0
        }]);

        return stored;
    }

    static async createPlant(user_id, slug) {
        const plantType = await almanac.getType(slug);
        const plant = {
            user_id: user_id,
            image: plantType.image,
            sun_exposure: "",
            location: "",
            type_id: plantType._id,
            plant_id: null
        };

        const storePlant = await this.store(Model.Plant, null, plant);
        return storePlant;
    }

    static async getPlantById(plant_id) {
        const stored = await this.findOne(Model.Plant, {
            _id: plant_id
        })

        return stored;
    }

    static async getPlantsByGardenId(garden_id) {
        const stored = await this.find(Model.Plant, {
            garden_id
        });

        return stored;
        // const stored = await this.getGardenById(garden_id);
        // if(stored) {
        //     return stored.plants;
        // } else {
        //     return [];
        // }
    }

    static async addTypeToGarden(garden_id, slug) {
        try {
            const garden = await this.getGardenById(garden_id);
            if (garden) {
                const plant = await this.createPlant(garden.user_id, slug);
                garden.plants.push(plant);
                const stored = await this.store(Model.Garden, "_id", garden);
                return stored;
            }
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    static async selectPlantSpecies(plant_id, species_id) {
        try {
            const plant = await this.getPlantById(plant_id);
            const species = await trefle.getPlant(species_id);
            plant.plant_id = species._id;
            const storePlant = await this.store(Model.Plant, null, plant);
            return storePlant;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    static async updatePlantPhoto(plant_id, filename) {
        const plant = await this.getPlantById(plant_id);
        plant.image = this.photos_dir + "/" + filename;
        const storePlant = await this.store(Model.plant, null, plant);
        return storePlant;
    }



}


module.exports = Plantbase;
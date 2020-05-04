const PlantProvider = require("./PlantProvider");
const {
    Model,
    passport
} = require("../Database");
const validator = require('validator');
const almanac = require("./Almanac");
const trefle = require("./Trefle");
const aws = require("../aws");


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
        try {
            if (!username) {
                throw new Error("Please enter a username");
            } else if (!password) {
                throw new Error("Please enter a password");
            }
            const result = await Model.User.authenticate()(username, password);
            return result;
        } catch(e) {
            throw new Error(e);
        }
    }

    static async loginUser(req) {
        if (!req.body.username) {
            throw new Error("Please enter a username");
        } else if (!req.body.password) {
            throw new Error("Please enter a password");
        }

        return new Promise(async (resolve, reject) => {
            try {
                const result = await Model.User.authenticate()(req.body.username, req.body.password);
                if (!result.user) {
                    throw new Error("Username or password is incorrect");
                }

                req.login(result.user, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(req.user);
                    }
                });
            } catch(e) {
                reject(e);
            }
        }).catch(e => {
            throw new Error(e);
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

    static async getAllGardens() {
        const stored = await this.find(Model.Garden, null, [{
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
        }, ['plants', {
            field: 'user_id',
            email: 0,
            __v: 0,
            ip: 0
        }]);

        return stored;
    }

    static async createPlant(garden_id, user_id, slug) {
        const plantType = await almanac.getType(slug);
        const plant = {
            garden_id: garden_id,
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
        }, ['type_id', 'plant_id'])

        return stored;
    }

    static async getPlantsByGardenId(garden_id, full = true) {
        const populate = full ? ['type_id', 'plant_id'] : [];
        const stored = await this.find(Model.Plant, {
            garden_id
        }, populate);

        return stored;
    }

    static async addTypeToGarden(user_id, garden_id, slug) {
        const garden = await this.getGardenById(garden_id);
        if (garden) {
            if (user_id.toString() !== garden.user_id._id.toString()) {
                throw new Error("User does not own this garden");
            }

            const plant = await this.createPlant(garden._id, garden.user_id, slug);
            
            const gardenPlants = await this.getPlantsByGardenId(garden._id);
            const plant_ids = gardenPlants.map(p => p._id);
            garden.plants = plant_ids;
            const stored = await this.store(Model.Garden, "_id", garden);
            return plant;
        }
    }

    static async deletePlantFromGarden(user, plant_id) {
        const plant = await this.getPlantById(plant_id, false);
        if (user._id.toString() !== plant.user_id.toString()) {
            throw new Error("User does not own this plant");
        }
        const garden = await this.getGardenById(plant.garden_id);
        garden.plants = garden.plants.filter(p => p._id !== plant._id);
        const storedGarden = await this.store(Model.Garden, "_id", garden);
        const deleted = await this.deleteOne(Model.Plant, {
            _id: plant._id
        });
        return plant;
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
        const storePlant = await this.store(Model.Plant, null, plant);
        return storePlant;
    }



}


module.exports = Plantbase;
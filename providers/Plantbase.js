const PlantProvider = require("./PlantProvider");
const {
    Model,
    passport
} = require("../Database");
const validator = require('validator');
const almanac = require("./Almanac");
const trefle = require("./Trefle");

class Plantbase extends PlantProvider {
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
        } catch (e) {
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
            } catch (e) {
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

    static async getAllPlants(populate = []) {
        const stored = await this.find(Model.Plant, null, populate);
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
            plant_id: null,
            watering: {
                has_watered: false,
                last_watered: null,
                every: plantType.watering.every || null,
            }
        };

        const storePlant = await this.store(Model.Plant, null, plant);
        return storePlant;
    }

    static async getPlantById(plant_id, full = true) {
        const populate = full ? ['type_id', 'plant_id'] : [];
        const stored = await this.findOne(Model.Plant, {
            _id: plant_id
        }, populate)

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

    static async deleteGarden(user, garden_id) {
        const garden = await this.getGardenById(garden_id, false);
        if (user._id.toString() !== garden.user_id.toString()) {
            throw new Error("User does not own this garden");
        }

        const deleted = await this.deleteOne(Model.Garden, {
            _id: garden._id
        });
        return deleted;
    }

    static async deletePlantFromGarden(user, plant_id) {
        const plant = await this.getPlantById(plant_id, false);
        if (user._id.toString() !== plant.user_id.toString()) {
            throw new Error("User does not own this plant");
        }

        if (plant.image.includes("amazonaws.com")) {
            await this.deleteFile(plant.image.split("/").pop());
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

            const isUploaded = !plant.image.includes("amazonaws.com");
            if (isUploaded && species.images.length) {
                plant.image = species.images[0].url;
            } else if (isUploaded && !species.images.length) {
                plant.image = plant.type_id.image;
            }

            const storePlant = await this.store(Model.Plant, null, plant);
            return await this.getPlantById(plant_id);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    static async updateAllWatered() {
        return new Promise(async (resolve) => {
            const plants = await this.getAllPlants(['type_id']);
            let count = 0;
            for (let i = 0; i < plants.length; i++) {

                const plant = plants[i];
                const has_watered = plant.watering.has_watered;
                const last_watered = plant.watering.last_watered;
                const every = plant.watering.every || plant.type_id.every;

                if (last_watered) {
                    const now = Date.now();
                    const time_since = now - last_watered;
                    if (has_watered && time_since >= every) {
                        await this.setHasWatered(plant.user_id, plant._id, false);
                        count++;
                    }
                }

                if (i === plants.length - 1) {
                    resolve(count);
                }
            }
        })
    }

    static async getRelatedSpecies(plant_id) {
        const plant = await this.getPlantById(plant_id);
        const terms = plant.type_id.terms;
        let results = [];

        for (let i = 0; i < terms.length; i++) {
            const search = await trefle.searchPlants(terms[i]);
            results.push(...search);
        }


        results = results.map(result => ({
            name: result.scientific_name,
            value: result.id
        }));


        results = results.filter((e, i) => results.findIndex(a => a["name"] === e["name"]) === i);
        results = results.sort((a, b) => (a.name > b.name) ? 1 : -1);

        return results;
    }

    static async getUserSession(req) {
        if(req.user) {
            const session = Object.assign({}, req.user._doc);
            delete session.attempts;
            delete session.email;
            delete session.ip;
            delete session._v;

            const notifications = await this.getNotifications(req.user._id, 10);
            session.notifications = notifications;
            return session;
        } else {
            return false;
        }
    }

    static async notify(user_id, title, body, link = "/", icon = null) {
        const store = await this.store(Model.Notification, null, {
            user_id,
            title,
            body,
            link,
            read: false,
            icon
        });

        return store;
    }

    static async getNotifications(user_id, count=10) {
        const find = await Model.Notification.find({
            user_id: user_id
        })
        .sort({ field: 'asc', _id: -1 }).limit(count);

        return find;
    }

    static async readNotification(user_id, notification_id) {
        const notification = await this.findOne(Model.Notification, {
            _id: notification_id
        });

        if (user_id.toString() !== notification.user_id.toString()) {
            throw new Error("User does not own this notification");
        }

        notification.read = true;
        const store = await this.store(Model.Notification, "_id", notification);
        return store;
    }

    static async setHasWatered(user_id, plant_id, has_watered) {
        if (!plant_id) {
            throw new Error("Plant ID is invalid");
        }

        const plant = await this.getPlantById(plant_id, false);
        if (!plant) {
            throw new Error("Plant does not exist");
        }

        if (user_id.toString() !== plant.user_id.toString()) {
            throw new Error("User does not own this plant");
        }

        plant.watering.has_watered = has_watered ? true : false;
        plant.watering.last_watered = has_watered ? Date.now() : plant.watering.last_watered;

        if(has_watered === false) {
            await this.notify(plant.user_id, plant._id, "This plant needs watering", "/garden/"+plant.garden_id, "tint");
        }

        const storeWatering = await this.store(Model.WateringLog, null, {
            user_id: plant.user_id,
            plant_id: plant._id,
            has_watered: plant.watering.has_watered,
            last_watered: plant.watering.last_watered
        });
        const storePlant = await this.store(Model.Plant, null, plant);
        return plant.watering;
    }

    static async updatePlantPhoto(req) {
        if (!req.body.plant_id) {
            throw new Error("Plant ID is invalid");
        }
        if (!req.file.filename) {
            throw new Error("There was an error uploading that file");
        }
        const plant = await this.getPlantById(req.body.plant_id);
        if (req.user._id.toString() !== plant.user_id.toString()) {
            throw new Error("User does not own this plant");
        }

        const photoStore = await this.uploadFile(req.file.path);

        if (plant.image.includes("amazonaws.com")) {
            await this.deleteFile(plant.image.split("/").pop());
        }

        plant.image = photoStore.Location;

        const storePlant = await this.store(Model.Plant, null, plant);
        return photoStore.Location;
    }



}


module.exports = Plantbase;
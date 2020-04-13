const storage = require("./cache");
const almanac = require("./providers/Almanac");
const uuidv4 = require('uuid/v4');

class GardenDB {
    static get db_name() {
        return "plant-index-db";
    }

    static get photos_dir() {
        return "assets/images/plants";
    }

    static async getDB() {
        let db = await storage.getCache(this.db_name);
        if(!db) {
            db = await storage.setCache(this.db_name, {
                plants: []
            });
        }
        return db;
    }

    static async setDB(db) {
        const store = await storage.setCache(this.db_name, db);
        return store;
    }

    static async add(slug) {
        const db = await this.getDB();
        db.plants.push({
            id: uuidv4(),
            slug,
            moisture: 3,
            photo: false,
            location: "greenhouse",
            sun_exposure: "Full Sun"
        });
        const update = await this.setDB(db);
        return update;
    }

    static async update(id, plantValues) {
        if(id) {
            const db = await this.getDB();
            const search = db.plants.filter(plant => plant.id === id);
            if(search.length) {
                Object.keys(plantValues).forEach(plantKey => {
                    search[0][plantKey] = plantValues[plantKey];
                });

                await this.setDB(db);
            }
        }
    }

    static async getPlant(id) {
        const db = await this.getDB();
        const search = db.plants.filter(plant => plant.id === id);
        if(search.length) {
            return search[0];
        } else {
            return false;
        }
    }

    static async getCount(slug) {
        const db = await this.getDB();
        let count = 0;
        db.plants.forEach(plant => {
            if(plant.slug === slug) {
                count++;
            }
        });
        return count;
    }

    static async getAll() {
        const db = await this.getDB();
        db.plants = await Promise.all(db.plants.map(async plant => {
            plant.details = await almanac.getPlant(plant.slug);
            plant.photo = (plant.photo ? this.photos_dir + "/" + plant.photo : plant.details.image);
            return plant;
        }));
        return db;
    }
}



module.exports = GardenDB;
const PlantProvider = require("./PlantProvider");
const Model = require("../Database");

const almanac = require("./Almanac");
const trefle = require("./Trefle");


class Plantbase extends PlantProvider {
    static photos_dir = "../assets/images/plants";
    
    static async createGarden(user_id, name) {
        const garden = {
            user_id,
            name,
            plants: []
        };
        const store = await this.store(Model.Garden, null, garden);
        return store;
    }

    static async getGardenById(garden_id) {
        const stored = await this.findOne(Model.Garden, {
            _id: garden_id
        })

        return stored;
    }
    
    static async getGardensByUserId(user_id) {
        const stored = await this.find(Model.Garden, {
            user_id
        });

        return stored;
    }

    static async createPlant(user_id, slug) {
        const plantType = await almanac.getType(slug);
        const plant = {
            user_id: user_id,
            image: plantType.image,
            sun_exposure: "",
            location: "",
            type_slug: plantType.slug,
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

    static async addTypeToGarden(user_id, garden_id, slug) {
        const garden = await this.getGardenById(garden_id);
        const plant = await this.createPlant(user_id, slug);
        garden.plants.push(plant._id);
        const storeGarden = await this.store(Model.Garden, "_id", garden);
        return storeGarden;
    }

    static async selectPlantSpecies(plant_id, species_id) {
        const plant = await this.getPlantById(plant_id);
        const species = await trefle.getPlant(species_id);
        plant.plant_id = species._id;
        const storePlant = await this.store(Model.Plant, null, plant);
        return storePlant;
    }


    
}


module.exports = Plantbase;
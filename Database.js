const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dan:Fredwarrior123@cluster0-gluxm.mongodb.net/plantbase?retroWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const Schema = mongoose.Schema;
const Model = {};


const userSchema = new Schema({
    username: String,
    password: String,
});

const plantSchema = new Schema({
    photo: String,
    sun_exposure: String,
    location: String,
    type_slug: String
});

const gardenSchema = new Schema({
    user_id: mongoose.ObjectId,
    name: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    plants: {
        type: [plantSchema],
        default: undefined
    }
});


const almanacSearchSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    title: String,
    link: String,
    thumbnail: String
});


const almanacTypeSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    name: String,
    image: String,
    botanical_name: String,
    plant_type: String,
    sun_exposure: String,
    soil_type: String,
    soil_ph: String,
    bloom_time: String,
    flower_color: String,
    hardiness_zones: [Number],
    special_features: String,
    planting: [String],
    care: [String],
    pests: [String],
    pest_control: [String],
    harvest: [String],
    stats: [String]
});


const trefleSearchSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    scientific_name: String,
    link: String,
    common_name: String,
    id: {
        type: Number,
        unique: true
    },
    complete_data: Boolean
});


const treflePlantSchema = new Schema({
    varieties: [{
        author: String,
        bibliography: String,
        common_name: String,
        complete_data: Boolean,
        family_common_name: String,
        id: Number,
        is_main_species: Boolean,
        link: String,
        main_species_id: Number,
        scientific_name: String,
        slug: String,
        sources: [{
            last_update: String,
            name: String,
            source_url: String,
            species_id: Number
        }],
        status: String,
        synonym: Boolean,
        type: String,
        year: String
    }],
    sub_sepcies: [{
        author: String,
        bibliography: String,
        common_name: String,
        complete_data: Boolean,
        family_common_name: String,
        id: Number,
        is_main_species: Boolean,
        link: String,
        main_species_id: Number,
        scientific_name: String,
        slug: String,
        sources: [{
            last_update: String,
            name: String,
            source_url: String,
            species_id: Number
        }],
        status: String,
        synonym: Boolean,
        type: String,
        year: String
    }],
    scientific_name: String,
    order: {
        slug: String,
        name: String,
        link: String,
        id: Number
    },
    native_status: String,
    main_species: {
        year: String,
        type: String,
        synonym: String,
        status: String,
        specifications: {
            toxicity: String,
            shape_and_orientation: String,
            regrowth_rate: String,
            nitrogen_fixation: String,
            max_height_at_base_age: {
                ft: Number,
                cm: Number
            },
            mature_height: {
                ft: Number,
                cm: Number
            },
            low_growing_grass: String,
            lifespan: String,
            leaf_retention: String,
            known_allelopath: String,
            growth_rate: String,
            growth_period: String,
            growth_habit: String,
            growth_form: String,
            fire_resistance: String,
            fall_conspicuous: String,
            coppice_potential: String,
            c_n_ratio: String,
            bloat: String
        },
        sources: [{
            species_id: Number,
            source_url: String,
            name: String,
            last_update: String
        }],
        soils_adaptation: {
            medium: String,
            fine: String,
            coarse: String
        },
        slug: String,
        seed: {
            vegetative_spread_rate: String,
            small_grain: String,
            seeds_per_pound: String,
            seedling_vigor: String,
            seed_spread_rate: String,
            commercial_availability: String,
            bloom_period: String
        },
        scientific_name: String,
        propagation: {
            tubers: String,
            sprigs: String,
            sod: String,
            seed: String,
            cuttings: String,
            corms: String,
            container: String,
            bulbs: String,
            bare_root: String
        },
        products: {
            veneer: String,
            pulpwood: String,
            protein_potential: String,
            post: String,
            palatable_human: String,
            palatable_graze_animal: String,
            palatable_browse_animal: String,
            nursery_stock: String,
            naval_store: String,
            lumber: String,
            fuelwood: String,
            fodder: String,
            christmas_tree: String,
            berry_nut_seed: String
        },
        native_status: String,
        main_species_id: String,
        is_main_species: String,
        images: [{
            url: String
        }],
        id: Number,
        growth: {
            temperature_minimum: {
                deg_f: Number,
                deg_c: Number
            },
            shade_tolerance: String,
            salinity_tolerance: String,
            root_depth_minimum: {
                inches: Number,
                cm: Number
            },
            resprout_ability: String,
            precipitation_minimum: {
                inches: Number,
                cm: Number
            },
            precipitation_maximum: {
                inches: Number,
                cm: Number
            },
            planting_density_minimum: {
                sqm: Number,
                acre: Number
            },
            planting_density_maximum: {
                sqm: Number,
                acre: Number
            },
            ph_minimum: Number,
            ph_maximum: Number,
            moisture_use: String,
            hedge_tolerance: String,
            frost_free_days_minimum: Number,
            fire_tolerance: String,
            fertility_requirement: String,
            drought_tolerance: String,
            cold_stratification_required: String,
            caco_3_tolerance: String,
            anaerobic_tolerance: String
        },
        fruit_or_seed: {
            seed_persistence: String,
            seed_period_end: String,
            seed_period_begin: String,
            seed_abundance: String,
            conspicuous: String,
            color: String
        },
        foliage: {
            texture: String,
            porosity_winter: String,
            porosity_summer: String,
            color: String
        },
        flower: {
            conspicuous: String,
            color: String
        },
        family_common_name: String,
        duration: String,
        complete_data: String,
        common_name: String,
        bibliography: String,
        author: String
    },
    images: [{
        url: String
    }],
    id: Number,
    hybrids: [{
        author: String,
        bibliography: String,
        common_name: String,
        complete_data: Boolean,
        family_common_name: String,
        id: Number,
        is_main_species: Boolean,
        link: String,
        main_species_id: Number,
        scientific_name: String,
        slug: String,
        sources: [{
            last_update: String,
            name: String,
            source_url: String,
            species_id: Number
        }],
        status: String,
        synonym: Boolean,
        type: String,
        year: String
    }],
    genus: {
        slug: String,
        name: String,
        link: String,
        id: Number
    },
    forms: [{
        author: String,
        bibliography: String,
        common_name: String,
        complete_data: Boolean,
        family_common_name: String,
        id: Number,
        is_main_species: Boolean,
        link: String,
        main_species_id: Number,
        scientific_name: String,
        slug: String,
        sources: [{
            last_update: String,
            name: String,
            source_url: String,
            species_id: Number
        }],
        status: String,
        synonym: Boolean,
        type: String,
        year: String
    }],
    family_common_name: String,
    family: {
        slug: String,
        name: String,
        link: String,
        id: Number,
        common_name: String
    },
    duration: String,
    division: {
        slug: String,
        name: String,
        link: String,
        id: Number
    },
    cultivars: [{
        author: String,
        bibliography: String,
        common_name: String,
        complete_data: Boolean,
        family_common_name: String,
        id: Number,
        is_main_species: Boolean,
        link: String,
        main_species_id: Number,
        scientific_name: String,
        slug: String,
        sources: [{
            last_update: String,
            name: String,
            source_url: String,
            species_id: Number
        }],
        status: String,
        synonym: Boolean,
        type: String,
        year: String
    }],
    common_name: String,
    class: {
        slug: String,
        name: String,
        link: String,
        id: Number
    }
});


Model.User = mongoose.model("User", userSchema);
Model.Plant = mongoose.model("Plant", plantSchema);
Model.Garden = mongoose.model("Garden", gardenSchema);

Model.AlmanacSearch = mongoose.model("AlmanacSearch", almanacSearchSchema);
Model.AlmanacType = mongoose.model("AlmanacType", almanacTypeSchema);

Model.TrefleSearch = mongoose.model("TrefleSearch", trefleSearchSchema);
Model.TreflePlant = mongoose.model("TreflePlant". treflePlantSchema);


module.exports = Model;
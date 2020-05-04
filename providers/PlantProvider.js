const { Model } = require("../Database");
const fetch = require("node-fetch");
const aws = require("../aws");

class PlantProvider {

    static levDist(a, b) {
        const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
        for (let i = 0; i <= a.length; i += 1) {
            distanceMatrix[0][i] = i;
        }

        for (let j = 0; j <= b.length; j += 1) {
            distanceMatrix[j][0] = j;
        }
        for (let j = 1; j <= b.length; j += 1) {
            for (let i = 1; i <= a.length; i += 1) {
                const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                distanceMatrix[j][i] = Math.min(
                    distanceMatrix[j][i - 1] + 1, // deletion
                    distanceMatrix[j - 1][i] + 1, // insertion
                    distanceMatrix[j - 1][i - 1] + indicator, // substitution
                );
            }
        }

        return distanceMatrix[b.length][a.length];
    }


    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    static getFilter(filterThis) {
        const filtered = {};
        Object.keys(filterThis).forEach(key => {
            let value = filterThis[key];

            if(key === "$or" || key === "$and") {
                value = value.map(condition => {
                    return this.getFilter(condition);
                });
                filtered[key] = value;
            } else {
                const queryValue = {
                    $regex: '.*' + value + '.*',
                    $options: 'i'
                }
                filtered[key] = queryValue;
            }

        });

        return filtered;
    }

    static async findLike(model, filterQuery, limit=false) {
        const filter = this.getFilter(filterQuery);

        try {
            let query = model.find(filter);
            
            if(limit) {
                query.limit(limit);
            
            }
            const result = await query.exec();
            return result;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async find(model, filter, populate) {
        let search = model.find(filter);
        if(populate) {
            if(!Array.isArray(populate)) {
                populate = [populate];
            }
            populate.forEach(pop => {
                if(typeof pop === "object" ) {
                    const field_name = pop.field;
                    delete pop.field;
                    search = search.populate(field_name, pop);
                } else if(typeof pop === "string") {
                    search = search.populate(pop);
                }
            })
        }
        const storedSearch = await search.exec();
        return storedSearch;
    }

    static async findOne(model, filter, populate) {
        let search = model.findOne(filter);
        if(populate) {
            if(!Array.isArray(populate)) {
                populate = [populate];
            }
            populate.forEach(pop => {
                if(typeof pop === "object" ) {
                    const field_name = pop.field;
                    delete pop.field;
                    search = search.populate(field_name, pop);
                } else if(typeof pop === "string") {
                    search = search.populate(pop);
                }
            })
        }
        const storedSearch = await search.exec();
        return storedSearch;
    }


    static async deleteLike(model, filterQuery, limit=false) {
        const filter = this.getFilter(filterQuery);

        try {
            let query = model.deleteMany(filter);
            
            if(limit) {
                query.limit(limit);
            }
            const result = await query.exec();
            return result;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async delete(model, filter) {
        let search = model.deleteMany(filter);
        const storedSearch = await search.exec();
        return storedSearch;
    }

    static async deleteOne(model, filter) {
        let search = model.deleteOne(filter);
        const storedSearch = await search.exec();
        return storedSearch;
    }

    static async store(model, filterKey, update) {
        const filter = {};
        if(filterKey) {
            filter[filterKey] = update[filterKey];
            const count = await model.countDocuments(filter);
            const doc = await model.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
    
            return doc;
        } else {
            const result = await model.create(update);
            return result;
        }
    }

    static async storeMany(model, filterKey, updateArray) {
        updateArray = updateArray.map(update => {
            return this.store(model, filterKey, update);
        });

        const docs = await Promise.all(updateArray);

        return docs;
    }

    static async callAPI(path, params = {}) {
        const url = new URL(`${this.url}/api/${path}`);
        const searchParams = {
            ...params
        };
        if (this.token) {
            searchParams.token = this.token;
        }

        Object.keys(searchParams).forEach(key => {
            url.searchParams.set(key, searchParams[key])
        });


        const request = await fetch(url.href).catch(error => console.error(error));
        const json = await request.json();
        return json;
    }

    static async uploadFile(path) {
        const res = await aws.uploadFile("plantbase", path);
        return res;
    }

    static async deleteFile(key) {
        const res = await aws.deleteFile("plantbase", key);
        return res;
    }

}




module.exports = PlantProvider;
const fetch = require("node-fetch");
const storage = require("./cache");

const trefle = async url => {
    url = new URL("https://trefle.io/" + url);
    url.searchParams.set("token", "Qk5uKzM5K29Cdm9rZWl3eFNGU1M1QT09");

    const cache = await storage.getCache(url.href);
    if(cache) {
        return cache;
    } else {
        const request = await fetch(url.href).catch(error => console.error(error));
        const json = await request.json();
        const store = await storage.setCache(url.href, json);
        return json;
    }
};


module.exports = trefle;
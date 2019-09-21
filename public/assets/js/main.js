const dom = {
    nav: document.querySelector("nav"),
    modal: document.querySelector("#modal"),
    plantSearchForm: document.querySelector("#plantSearchForm"),
    plantList: document.querySelector("#plantList"),
    plantDisplay: document.querySelector("#plantDisplay"),
    gardenDisplay: document.querySelector("#gardenDisplay")
};

const menuLinks = [
    {name: "Plant Index", link: "index.html"},
    {name: "My Garden", link: "garden.html"}
];

const loader = `<img class="loader" src="assets/images/loader.gif" />`;

const showModal = (title, content) => {
    dom.modal.style.display = "block";

};

const hideModal = () => {
    dom.modal.style.display = "none";
};

const get = async url => {
    const result = await fetch("api/"+url);
    const json = await result.json();
    return json;
}

const getSeason = (date) => {
    const month = date.getMonth()+1;
    season = 'unknown';
    switch(month) {
        case 'dec':
        case 'december':
        case 12:
        case 'jan':
        case 'january':
        case 1:
        case 'feb':
        case 'february':
        case 2:
            season = 'Summer';
        break;
        case 'mar':
        case 'march':
        case 3:
        case 'apr':
        case 'april':
        case 4:
        case 'may':
        case 5:
            season = 'Autumn';
        break;
        case 'jun':
        case 'june':
        case 6:
        case 'jul':
        case 'july':
        case 7:
        case 'aug':
        case 'august':
        case 8:
            season = 'Winter';
        break;
        case 'sep':
        case 'september':
        case 9:
        case 'oct':
        case 'october':
        case 10:
        case 'nov':
        case 'november':
        case 11:
            season = 'Spring';
        break;
    }
    return season;
}

const displayNav = () => {
    if(dom.nav) {
        menuLinks.push({ name: "Season: " + getSeason(new Date) });
        dom.nav.innerHTML = `
        <ul>
            ${menuLinks.map(item => {
                if(item.link) {
                    return `<li><a href="${item.link}">${item.name}</a></li>`;
                } else {
                    return `<li style="float: right;">${item.name}</li>`;
                }
            }).join("")}
        </ul>`;
    }
}

const displayPlant = async (slug, el) => {
    dom.plantDisplay.innerHTML = loader;
    const plant = await get("plant/"+slug);
    if(el) {
        dom.plantList.querySelectorAll("li a").forEach(a => a.classList.remove("active"));
        el.classList.add("active");
    }
    dom.plantDisplay.innerHTML = `
        <h3>
            ${plant.name}
            ${
                plant.count ?
                `<button id="index-button" class="active" onclick="addToGarden('${plant.slug}');">${plant.count}</button>` :
                `<button id="index-button" onclick="addToGarden('${plant.slug}');">+</button>`
            }
        </h3>
        <img src=${plant.image}" />
        <h4>Planting</h4>
        <ul>${plant.planting.map(li => `<li>${li}</li>`).join("")}</ul>
    
    `;
};

const addToGarden = async (slug) => {
    const button = document.getElementById("index-button");
    button.classList.add("active");
    const result = await get("add-plant/"+slug);
    if(result.success) {
        const count = button.innerText === "+" ? 1 : parseInt(button.innerText) + 1;
        button.innerHTML = count;
    }
}

const getSearchPlants = async query => {
    dom.plantList.innerHTML = loader;
    const results = await get("search/"+query);
    const list = results.map(result => {
        return `<li>
                    <a href="#" onclick="displayPlant('${result.slug}', this)">
                    <img src="${result.thumbnail}"/>
                    ${result.title}
                    </a>
                </li>`;
    }).join("");
    dom.plantList.innerHTML = `
        ${list}
    `;
};

const getGarden = async () => {
    const garden = await get("garden");
    return garden;
}


let garden = {};
const displayGardenPlant = async (id) => {
    let filtered = garden.plants.filter(p => p.id === id);
    if(!filtered.length) {
        return false;
    } else {
        const plant = filtered[0];
        showModal(plant.name);
    }
}

const displayGarden = async () => {
    garden = await getGarden();
    dom.gardenDisplay.innerHTML = `
        ${garden.plants.map(plant => {
            const details = plant.details;
            const thumbnail = details.image || './assets/images/placeholder-plant.png';
            return `
                <li id="${plant.id}">
                    <a href="#" onclick="displayGardenPlant('${plant.id}');">
                        <span class="plant-thumbnail" style="background-image:url('${thumbnail}')"></span>
                        <span class="plant-name">${details.name}</span>
                    </a>
                </li>
            `
        }).join("")}
    `;
}

const searchPlants = async () => {
    const input = plantSearchForm.querySelector("input");
    const value = input.value;
    if( value.trim() !== ""  && value.match(/^[0-9a-zA-Z]+$/)) {
        await getSearchPlants(value);
    }
}




displayNav();
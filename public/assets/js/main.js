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

const loaderSrc = `assets/images/loader.gif`;
const loader = `<img class="loader" src="${loaderSrc}" />`;
let modalCallback = null;
const showModal = (title=null, body=null, callback=null) => {
    const titleDom = dom.modal.querySelector(".modal-title");
    const bodyDom = dom.modal.querySelector(".modal-body");

    if(title) {
        titleDom.innerHTML = title;
    } else {
        titleDom.innerHTML = "";
    }
    bodyDom.innerHTML = "";
    if(!Array.isArray(body)) {
        body = [body];
    }
    body.forEach(el => {
        if(el) {
            if(el instanceof HTMLElement) {
                bodyDom.appendChild(el);
            } else {
                bodyDom.innerHTML += el;
            }
        }
    });
    dom.modal.style.display = "block";
    if(callback) {
        modalCallback = callback;
    }
};

const hideModal = () => {
    dom.modal.style.display = "none";
    if(typeof modalCallback === "function") {
        modalCallback();
        modalCallback = null;
    }
};

const get = async url => {
    const result = await fetch("api/"+url);
    const json = await result.json();
    return json;
};

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
};

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
        <h6>(${plant.botanical_name})</h6>
        <img src=${plant.image}" />
        <hr />
        ${plant.bloom_time.trim() !== "" ? `
            <h4>Bloom Season</h4>
            ${plant.bloom_time}
            <hr />
        ` : ""}

        ${plant.flower_color.trim() !== "" ? `
            <h4>Flower Colors</h4>
            <ul class="flower-colors">
                ${
                    plant.flower_color.split(",").map(color => {
                        color = color.trim();
                        if(color === 'Multicolor') {
                            return '';
                        }
                        return `<li style="background-color: ${color}"></li>`;
                    }).join("")
                }
            </ul>
            <hr />
        ` : ""}

        <h4>Planting</h4>
        <ul>${plant.planting.map(li => `<li>${li}</li>`).join("")}</ul>
        <hr />
    `;
    
    console.log(plant.flower_color);
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
                    <a href="javascript: void(0)" onclick="displayPlant('${result.slug}', this)">
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
        const title = `
            ${plant.details.name}
            <span class="botanical-name">(${plant.details.botanical_name})</span>
        `;
        const body = `
            <form id="upload-plant-form" onclick="changePlantPhoto(this);" style="background-image:url('${plant.photo}');" class="plant-photo" method="post" enctype="multipart/form-data">
                <input id="photo-upload" onchange="uploadPlantPhoto();" type="file" name="photo" />
                <input type="hidden" value="${plant.id}" name="id" />
            </form>
        `;

        console.log(plant);
        showModal(title, body);
        dom.upload_photo_form = document.querySelector("#upload-plant-form");
    }
}

const changePlantPhoto = () => {
    dom.upload_photo_form.querySelector("#photo-upload").click();
};

const uploadPlantPhoto = () => {
    const form = dom.upload_photo_form;
    const origSrc = form.style.backgroundImage;
    form.style.backgroundImage = `url('${loaderSrc}')`;
    let formData = new FormData(form);
    fetch('/api/plant-photo-upload', { method: 'POST', body: formData })
    .then(result => result.json())
    .then(result => {
        if(result.success) {
            setTimeout(() => {
                form.style.backgroundImage = `url('${result.src}')`;
                modalCallback = () => {
                    document.querySelector(`*[id="${formData.get("id")}"`)
                    .querySelector(".plant-thumbnail")
                    .style.backgroundImage = `url('${result.src}')`;
                };
            }, 2000);
        } else {
            form.style.backgroundImage = `url(${origSrc})`;
        }
    })
}

const displayGarden = async () => {
    dom.gardenDisplay.innerHTML = loader;
    garden = await getGarden();
    dom.gardenDisplay.innerHTML = `
        ${garden.plants.map(plant => {
            const details = plant.details;
            const thumbnail = plant.photo;
            return `
                <li id="${plant.id}">
                    <a href="javascript: void(0)" onclick="displayGardenPlant('${plant.id}');">
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
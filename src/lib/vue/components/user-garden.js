Vue.component('user-garden', {
    props: ['garden_id'],
    template: `
            <div>
                <user-garden-header v-bind:garden_id="garden_id"></user-garden-header>
                <garden-plants ref="garden_plants" v-bind:garden_id="garden_id"></garden-plants>
            </div>
        `
});
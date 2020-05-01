    Vue.component('plant-item', {
        props: ['plant'],
        data: () => ({
            colorClass: "green",
            deleteLoading: false,
        }),
        methods: {
            onClick(e) {
                console.log("test");
            },
        },
        computed: {
            userOwns() {
                return app.session._id === this.plant.user_id;
            },
        },
        mounted: function () {
            const [color] = this.plant.type_id.flower_color.split(",").map(c => c.trim().toLowerCase());
            if (!color || color === "varies") {
                this.colorClass = "green";
            } else {
                this.colorClass = color;
            }
        },
        template: `
            <a v-bind:click="onClick" v-bind:class="[colorClass]" class="plant-item ui card horizontal centered" href="#">
                <div class="image">
                    <img v-bind:src="plant.image">
                </div>
                <div class="content">
                    <div class="header">{{plant.type_id.name}}</div>
                    <div class="description">
                        {{plant.type_id.botanical_name}}
                    </div>
                    </div>

                    <template v-if="userOwns">
                        <div class="extra content">
                            <div class="ui two buttons">
                                <edit-plant-modal v-bind:plant="plant" ref="plant_modal"></edit-plant-modal>
                                <edit-plant-button v-bind:plant_id="plant._id"></edit-plant-button>
                                <delete-plant-button v-bind:plant_id="plant._id"></delete-plant-button>
                            </div>
                        </div>
                    </template>
                </div>
            </a>
            
        `
    });
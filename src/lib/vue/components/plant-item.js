    Vue.component('plant-item', {
        props: ['plant'],
        data: () => ({
            colorClass: "green",
            deleteLoading: false,
            waterLoading: false
        }),
        methods: {
            onClick(e) {
                console.log("test");
            },
            async waterDateChange() {
                const date = $(this.$el).find(".datepicker").calendar("get date");
                if(date) {
                    this.waterLoading = true;
                    const res = await formEncodedPOST("/api/set-has-watered", {
                        plant_id: this.plant._id
                    });
                    this.waterLoading = false;
                    if (res.success) {
                        this.plant.watering = res.success;
                    } else {
                        $('body')
                        .toast({
                            class: 'error',
                            message: `${res.error}`,
                            displayTime: 1000,
                            position: window.innerWidth <= 770 ? "top center" : "top right"
                        });
                    }
                }
            },
            async waterPlant() {
                $(this.$el).find('.datepicker').calendar('focus');
            }
        },
        computed: {
            userOwns() {
                return app.session._id === this.plant.user_id;
            },
            scientific_name: function() {
                return this.plant.plant_id && this.plant.plant_id.scientific_name ? this.plant.plant_id.scientific_name : this.plant.type_id.botanical_name;
            }
        },
        mounted: function () {
            const [color] = this.plant.type_id.flower_color.split(",").map(c => c.trim().toLowerCase());
            if (!color || color === "varies") {
                this.colorClass = "green";
            } else {
                this.colorClass = color;
            }

            $(this.$el).find('.datepicker')
            .calendar({
                type: 'time',
                maxDate: new Date(),
                onHide: this.waterDateChange
            })
        },
        template: `
            <a v-bind:click="onClick" v-bind:class="[colorClass]" class="plant-item ui card horizontal centered" href="#">
                <div class="image">
                    <img v-bind:src="plant.image">
                </div>
                <div class="content">
                    <div class="header">
                        {{plant.type_id.name}}
                        <template v-if="!plant.watering.has_watered">
                            <i class="tint icon blue"></i>
                        </template>
                    </div>
                    <div class="description">
                        {{scientific_name}}
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
                <template v-if="userOwns && !plant.watering.has_watered">
                    <div class="ui bottom attached button blue" v-bind:class="{loading: waterLoading, disabled: waterLoading}" @click.prevent="waterPlant">
                        <i class="tint icon"></i>
                        Mark as watered
                        <div class="ui calendar datepicker">
                            <input type="text" placeholder="Date">
                        </div>
                    </div>
                </template>
            </a>
            
        `
    });
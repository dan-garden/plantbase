Vue.component('edit-plant-species-select', {
    props: ['plant', 'modal_showing'],
    data: () => ({
        loading: false,
        retrieved: false,
        error: false,
    }),
    methods: {
        // getPlantValue() {
        //     return $(this.$el).find('.ui.dropdown')
        //     .dropdown('get value');
        // },

        async getRelatedSpecies() {
            this.loading = true;
            const req = await fetch("/api/get-related-species/" + this.plant._id);
            const res = await req.json();
            this.loading = false;
            if(res.success) {
                return res.success;
            } else {
                return [];
            }
        },

        async updateSpeciesType(species_id) {
            this.error = false;
            this.loading = true;
            const res = await formEncodedPOST("/api/select-plant-species", {
                plant_id: this.plant._id,
                species_id
            });
            this.loading = false;
            if (res.error) {
                this.error = res.error;
            } else if (res.success) {
                this.$parent.setPlant(res.success);
                // this.plant = res.success;
                // this.$parent.$parent.$parent.reload();
                // this.$parent.plant = res.success;
            }
        },

        async onChange(species_id, text) {
            if(species_id && species_id !== "" && text !== this.scientific_name) {
                await this.updateSpeciesType(species_id);
                // this.$parent.$parent.$parent.reload();
            }
        }
    },

    computed: {
        scientific_name: function() {
            return this.plant.plant_id && this.plant.plant_id.scientific_name ? this.plant.plant_id.scientific_name : this.plant.type_id.botanical_name;
        }
    },

    watch: { 
        modal_showing: async function(showing, oldVal) {
            if(showing && !this.retrieved) {
                const values = await this.getRelatedSpecies();
                $(this.$el).dropdown('change values', values);
                this.retrieved = true;
                const [selected] = values.filter(species => {
                    return species.name.toLowerCase() === this.scientific_name.toLowerCase();
                });
                
                if(selected) {
                    $(this.$el).dropdown("set selected", selected.value);
                }
            }
        }
    },
    mounted: async function() {
        $(this.$el)
        .dropdown({
            direction: 'upward',
            placeholder: "Select Species",
            forceSelection: false,
            onChange: this.onChange,
        });

    },
    template: `
    <div class="ui dropdown search fluid selection" v-bind:class="{loading: loading, disabled: loading}">
        <i class="dropdown icon"></i>
        <span class="text">Select Species</span>
        <div class="menu"></div>
    </div>
    `
});
Vue.component('edit-plant-species-select', {
    props: ['plant'],
    methods: {
        getPlantValue() {
            return $(this.$el).find('.ui.dropdown')
            .dropdown('get value');
        },
        
        setInitialPlant() {
            $(this.$el)
            .dropdown('set text', this.plant.type_id.botanical_name);
            $(this.$el).find('.search')
            .val(this.plant.type_id.name);
        }
    },
    mounted: function() {
        $(this.$el)
        .dropdown({
            direction: 'upward',
            // action: 'combo',
            clearable: true,
            // apiSettings: { url: '/api/select-search-plant/{query}' },
        });

        this.setInitialPlant();
    },
    template: `
    <div class="ui search selection dropdown fluid">
        <input type="hidden" name="plant_id">
        <i class="dropdown icon"></i>
        <div class="default text"></div>
        <div class="menu"></div>
    </div>
    `
});
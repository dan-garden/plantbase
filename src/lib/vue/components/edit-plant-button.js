Vue.component('edit-plant-button', {
    props: ["plant_id"],
    methods: {
        async editPlant() {
            this.$parent.$refs.plant_modal.showModal();
        }
    },
    template: `
        <button class="ui labeled icon button basic" @click.prevent="editPlant">
            <i class="edit icon blue"></i>
            Edit
        </button>
        `
});
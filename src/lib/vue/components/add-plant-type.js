Vue.component('add-plant-type', {
    props: ['garden_id'],
    data: () => ({
        modal: false,
        searchBox: false,
        searchQuery: "",
        searchInterval: 300,
        searchTimer: false,
        searchLoading: false,
        searchResults: [],
        error: false,
    }),
    methods: {
        showModal: function () {
            this.modal.modal('show');
            if(window.innerWidth <= 770 ) {
                this.searchBox.blur();
            }
        },
        onDeny: function () {
            return;
        },
        onApprove: function () {
            (async () => {

            })();
            return false;
        },
        async searchPlantTypes() {
            if(window.innerWidth <= 770 ) {
                this.searchBox.blur();
            }
            
            if (this.searchQuery) {
                this.searchLoading = true;
                const req = await fetch("/api/search-type/" + this.searchQuery);
                const res = await req.json();
                this.searchResults = res;
                this.searchLoading = false;
            } else {
                this.searchResults = [];
            }
        }
    },
    mounted: async function () {
        this.searchBox = $(this.$el).find('.search input');
        this.searchBox.on("keyup", () => {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(this.searchPlantTypes, this.searchInterval);
        });

        this.searchBox.on("keydown", () => {
            clearTimeout(this.searchTimer);
        });


        this.modal = $(this.$el).find(".modal").modal({
            closable: true,
            transition: "horizontal flip",
            onDeny: this.onDeny,
            onApprove: this.onApprove
        });

    },
    template: `
        <div class="add-plant-container">
            <div class="ui modal small">
                <div class="header">
                    Add Plants
                </div>
                <div class="content add-plant-searchbox">
                    <div class="ui search" v-bind:class="{loading: searchLoading}">
                        <div class="ui left icon input">
                            <input v-model="searchQuery" class="prompt" type="text" placeholder="Search Plant Index">
                            <i class="seedling icon green"></i>
                        </div>
                    </div>
                </div>
                <div class="content scrolling">
                    <template v-if="searchResults.length">
                        <div class="search-results ui items">
                            <template v-for="type in searchResults">
                                <plant-type-result v-bind:garden_id="garden_id" v-bind:plant_type="type"></plant-type-result>
                            </template>
                        </div>
                    </template>
                </div>
                <div class="actions">
                    <div class="ui negative button">
                        Close
                    </div>
                </div>
            </div>
            <button @click.prevent="showModal" class="ui right labeled icon button positive">
                Add Plants <i class="plus right icon"></i>
            </button>
        </div>
        `
});
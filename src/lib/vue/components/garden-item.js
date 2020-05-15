Vue.component('garden-item', {
    props: ['garden'],
    methods: {

    },
    computed: {
        href: function () {
            return "/garden/" + this.garden._id;
        },
        userOwns() {
            return app.session._id === this.garden.user_id;
        },
        plantsText() {
            return this.garden.plants.length === 1 ? "Plant" : "Plants";
        },
    },
    template: `
            <a class="ui card green" v-bind:href="href">
                <div class="content">
                    <div class="header">{{garden.name}}</div>
                    <div class="description">
                        {{garden.description}}
                    </div>
                    </div>
                    <div class="extra content">
                        <span class="right floated">
                            By {{garden.user_id.username}}
                        </span>
                        <span>
                            <i class="seedling icon"></i>
                            {{garden.plants.length}} {{plantsText}}
                        </span>
                    </div>
                </div>
            </a>
        `
});
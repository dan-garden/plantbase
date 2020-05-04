Vue.component('edit-plant-modal', {
    props: ['plant'],
    data: () => ({
        modal: false,
    }),
    methods: {
        showModal: function () {
            this.modal.modal('show');
        },
        onDeny: function () {
            return;
        },
        onApprove: function () {
            (async () => {

            })();
            return false;
        },
        uploadPlantPhoto() {
            const form = this.$el.querySelector(".upload-photo-form");
            let formData = new FormData(form);
            formData.append("plant_id", this.plant._id);
            fetch('/api/plant-photo-upload', { method: 'POST', body: formData })
            .then(result => result.json())
            .then(result => {
                if(result.success) {
                    this.plant.image = result.src;
                }
            })
        },
        async changePhoto() {
            $(this.$el).find('input[type="file"]').click();
        }
    },
    mounted: function() {
        $(this.$el).find('.special.cards .image').dimmer({
            on: 'hover'
        });

        this.modal = $(this.$el).modal({
            closable: true,
            transition: "zoom",
            onDeny: this.onDeny,
            onApprove: this.onApprove
        });
    },
    template: `
    <div class="ui modal small">
        <div class="header">
            Edit Plant - {{plant.type_id.name}}
        </div>
        <div class="content scrolling">
            <div class="ui special cards align center">
                <div class="card centered edit-plant-block">
                    <div class="blurring dimmable image">
                        <div class="ui dimmer">
                        <div class="content">
                            <div class="center">
                                <form class="ui hidden upload-photo-form">
                                    <div class="ui inverted button" @touchend.prevent="changePhoto" @click.prevent="changePhoto">
                                        <i class="upload icon"></i>
                                        Upload Photo
                                    </div>
                                    <input class="plant-photo-upload" @change.prevent="uploadPlantPhoto" type="file" name="photo" />
                                </form>
                            </div>
                        </div>
                        </div>
                        <img v-bind:src="plant.image" v-bind:alt="plant.type_id.name"/>
                    </div>
                    <div class="content">
                        <a class="header">{{plant.type_id.name}}</a>
                        <div class="meta">
                        <span class="date">{{plant.type_id.botanical_name}}</span>
                        </div>
                    </div>
                    <div class="extra content">
                        <a>
                        <i class="users icon"></i>
                        2 Members
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui negative button">
                Close
            </div>
        </div>
    </div>
    `,
})
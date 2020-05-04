Vue.component('edit-plant-modal', {
    props: ['plant'],
    data: () => ({
        modal: false,
        fileUploading: false,
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
        async uploadPlantPhoto() {
            this.fileUploading = true;
            const form = this.$el.querySelector(".upload-photo-form");
            let formData = new FormData(form);
            formData.append("plant_id", this.plant._id);
            const req = await fetch('/api/plant-photo-upload', { method: 'POST', body: formData });
            const res = await req.json();
            this.fileUploading = false;

            if(res.success) {
                this.plant.image = res.src;
            } else {
                $('body')
                .toast({
                    class: 'error',
                    message: `${res.error}`,
                    displayTime: 1000,
                    position: window.innerWidth <= 770 ? "top center" : "top right"
                });
            }
        },
        async changePhoto() {
            if(!this.fileUploading) {
                $(this.$el).find('input[type="file"]').click();
            }
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
                                        <template v-if="fileUploading">
                                            Uploading...
                                        </template>
                                        <template v-else-if="!fileUploading">
                                            <i class="upload icon"></i>
                                            Upload Photo
                                        </template>
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
Vue.component('edit-plant-modal', {
    props: ['plant'],
    data: () => ({
        modal: false,
        fileUploading: false,
        showing: false,
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
                this.setPhoto(res.src);
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

        setPhoto(src) {
            this.plant.image = src;
        },

        setPlant(plant) {
            this.plant = plant;
        },

        async changePhoto() {
            if(!this.fileUploading) {
                $(this.$el).find('input[type="file"]').click();
            }
        },


    },
    mounted: function() {
        $(this.$el).find('.special.cards .image').dimmer({
            on: 'hover'
        });

        this.modal = $(this.$el).modal({
            closable: true,
            transition: "zoom",
            autofocus: false,
            onDeny: this.onDeny,
            onApprove: this.onApprove,
            onShow: () => {
                this.showing = true;
            },
            onHidden: () => {
                this.showing = false;
            },
            onHide: () => {
                this.$parent.$parent.reload();
            }
        });
    },
    template: `
    <div class="ui modal small">
        <div class="header">
            Edit Plant - {{plant.type_id.name}}
        </div>
        <div class="content">
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
                            <span class="date">
                                {{plant._id}}
                            </span>
                        </div>
                    </div>
                    <div class="extra content">
                        <edit-plant-species-select v-bind:modal_showing="showing" v-bind:plant="plant"></edit-plant-species-select>
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
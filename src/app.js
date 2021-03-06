async function formEncodedPOST(url, data) {
    const body = new URLSearchParams();
    Object.keys(data).forEach(key => body.append(key, data[key]))
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body,
        redirect: 'follow'
    })
    const res = await req.json();
    return res;
}

window.app = new Vue({
    el: '#app',
    data: {
        session: false,
        loaded: false
    },
    computed: {
        url_garden_id: function () {
            return this.getLastURLPart();
        },
        url_plant_id: function() {
            return this.getLastURLPart();
        }
    },
    methods: {
        popup(type) {
            console.log(type);
        },

        getUserSession: async function () {
            const req = await fetch(`/api/session`);
            const res = await req.json();
            return res;
        },

        getLastURLPart() {
            return document.location.pathname.split("/").pop();
        },

        notify(data) {
            if(this.session && this.session.notifications) {
                this.session.notifications.unshift(data);
            }
        },
    },

    created: async function () {
        this.getUserSession().then(res => {
            this.session = res.session || false;
            this.loaded = true;
        });
    },

});
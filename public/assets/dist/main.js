(function () {

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

    Vue.component('top-nav', {
        props: ['session', 'loaded'],
        updated: function () {
            if (this.session) {
                $("nav .ui.dropdown").dropdown();
            }
        },
        template: `
        <nav>
            <ul>
                <li>
                    <a href="/">Plant Index</a>
                </li>
                <li>
                    <a href="/my-gardens">My Gardens</a>
                </li>
                <template v-if="loaded">
                    <li v-if="!session" data-float="right">
                        <a href="/">Sign In</a>
                    </li>
                    <li v-if="session" data-float="right">
                        <div class="ui pointing dropdown link item">
                            <span class="text">{{ session.username }}</span>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <a class="item">User Settings</a>
                                <div class="divider"></div>
                                <a class="item" href="/logout">Logout</a>
                            </div>
                        </div>
                    </li>

                </template>
                <template v-if="!loaded">
                    <li data-float="right"><div class="ui active green inline loader"></div></li>
                </template>
            </ul>
        </nav>
        `
    });


    Vue.component('register-form', {
        data: () => ({
            loading: false,
            error: false,
            email: "",
            username: "",
            password: "",
            passwordRepeat: ""
        }),
        computed: {
            buttonText: function () {
                return this.loading ? "Loading..." : "Register";
            }
        },
        methods: {
            onSubmit: async function (e) {
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/register", {
                    email: this.email,
                    username: this.username,
                    password: this.password,
                    passwordRepeat: this.passwordRepeat,
                    referrer: document.referrer
                });
                this.loading = false;
                if (res.error) {
                    this.error = res.error;
                } else if (res.success) {
                    app.session = res.success;
                }
                if (res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <div class="column register-form">
                <h2 class="ui green image header">
                    <img src="assets/images/logo.png" class="image">
                    <div class="content">
                        Register an account
                    </div>
                </h2>
                <form @submit.prevent="onSubmit" class="ui large form">
                    <div class="ui stacked segment">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="email"
                                v-model="email"
                                type="text"
                                placeholder="Email Address">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="username"
                                v-model="username"
                                type="text"
                                placeholder="Username">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="password"
                                v-model="password"
                                type="password"
                                placeholder="Password">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="passwordRepeat"
                                v-model="passwordRepeat"
                                type="password"
                                placeholder="Repeat Password">
                            </div>
                        </div>
                        
                        <button class="ui fluid large green submit button">{{ buttonText }}</button>
                    </div>
                </form>

                <div class="ui message">
                    Already have an account? <a href="/login">Sign In</a>
                </div>
            </div>

        `
    });


    Vue.component('login-form', {
        data: () => ({
            loading: false,
            error: false,
            username: "",
            password: "",
        }),
        computed: {
            buttonText: function () {
                return this.loading ? "Loading..." : "Login";
            }
        },
        methods: {
            onSubmit: async function (e) {
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/login", {
                    username: this.username,
                    password: this.password,
                    referrer: document.referrer
                });
                this.loading = false;
                if (res.error) {
                    this.error = res.error;
                } else if (res.success) {
                    app.session = res.success;
                }
                if (res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <div class="column login-form">
                <h2 class="ui green image header">
                    <img src="assets/images/logo.png" class="image">
                    <div class="content">
                        Log-in to your account
                    </div>
                </h2>
                <form @submit.prevent="onSubmit" class="ui large form">
                    <div class="ui stacked segment">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="username"
                                v-model="username"
                                type="text"
                                placeholder="Username">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="password"
                                v-model="password"
                                type="password"
                                placeholder="Password">
                            </div>
                        </div>
                        <button class="ui fluid large green submit button">{{ buttonText }}</button>
                    </div>
                </form>

                <div class="ui message">
                    New to us? <a href="/register">Sign Up</a>
                </div>
            </div>
        `
    })


    Vue.component('create-garden', {
        props: ['user_id'],
        data: () => ({
            modal: false,
            loading: false,
            error: false,
            name: "",
            description: ""
        }),
        methods: {
            showModal: function () {
                this.modal.modal('show');
            },
            onDeny: function() {
                return;
            },
            onApprove: function() {
                (async () => {
                    this.error = false;
                    this.loading = true;
                    const res = await formEncodedPOST("/api/create-garden", {
                        name: this.name,
                        description: this.description
                    });
                    this.loading = false;
                    if (res.error) {
                        this.error = res.error;
                    } else if (res.success) {
                        this.modal.modal('hide');
                        if(app.$refs.user_gardens) {
                            app.$refs.user_gardens.reload();
                            $(this.$el).find(".create-garden-modal form")[0].reset();
                        }
                    }
                })();
                return false;
            }
        },
        mounted: async function () {
            this.modal = $(this.$el).find(".create-garden-modal").modal({
                closable: false,
                transition: "horizontal flip",
                onDeny: this.onDeny,
                onApprove: this.onApprove
            });
        },
        template: `
        <div class="create-garden-container">
            <div class="ui modal tiny create-garden-modal">
                <div class="header">
                    Create Garden
                </div>
                <div class="content">
                    <form class="ui form" @submit.prevent="onApprove">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <label>Garden Name</label>
                            <input type="text" v-model="name" name="name" placeholder="Name">
                        </div>
                        <div class="field">
                            <label>Garden Description</label>
                            <textarea v-model="description" rows="2" name="description" placeholder="Description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="actions">
                    <template v-if="loading">
                        <div class="ui negative disabled inactive button">
                            Cancel
                        </div>
                        <div class="ui positive disabled inactive button">
                            Loading... <div class="ui active right inline mini loader"></div>
                        </div>
                    </template>
                    <template v-else-if="!loading">
                        <div class="ui negative button">
                            Cancel
                        </div>
                        <div class="ui positive right labeled icon button">
                            Create
                            <i class="plus right icon"></i>
                        </div>
                    </template>
                </div>
            </div>
            <button @click.prevent="showModal" class="ui right labeled icon button positive">
                Create Garden <i class="right plus icon"></i>
            </button>
        </div>
        `
    });


    Vue.component('garden-item', {
        props: ['garden'],
        methods: {
            onClick: function (e) {
                document.location = "/garden/" + this.garden._id
            }
        },
        template: `
            <div class="card green" @click.prevent="onClick">
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
                        {{garden.plants.length}} Plants
                    </span>
                </div>
            </div>
        `
    })


    Vue.component('user-gardens', {
        props: ['user_id'],
        data: () => ({
            loading: false,
            gardens: false
        }),
        methods: {
            async getUserGardens(user_id) {
                this.loading = true;
                const req = await fetch("/api/get-user-gardens/" + user_id);
                const res = await req.json();
                this.gardens = res;
                this.loading = false;
            },
            async reload() {
                if (this.user_id) {
                    await this.getUserGardens(this.user_id);
                }
            }
        },
        mounted: async function () {
            await this.reload();
        },
        template: `
            <div v-if="loading" class="loading-text">
                <div class="ui active large centered inline loader text green">Loading Gardens...</div>
            </div>
            <template v-else-if="!loading">
                <div v-if="gardens && gardens.length" class="gardens-list ui link cards">
                    <template v-for="garden in gardens">
                        <garden-item v-bind:garden="garden"></garden-item>
                    </template>
                </div>
                <div class="gardens-empty" v-else-if="gardens && !gardens.length">
                You have no gardens
                </div>
            </template>

        `
    });

    Vue.component('garden-plants', {
        props: ['garden_id'],
        data: () => ({
            loading: false,
            gardens: false
        }),
        methods: {
            async getGarden(garden_id) {
                this.loading = true;
                const req = await fetch("/api/get-garden-plants/" + garden_id);
                const res = await req.json();
                console.log(res);
                this.gardens = res;
                this.loading = false;
            },
            async reload() {
                if (this.garden_id) {
                    await this.getGarden(this.garden_id);
                }
            }
        },
        mounted: async function () {
            this.garden_id = document.location.pathname.split("/").filter(r=>r.length===24)[0];
            
            await this.reload();
        },
        template: `
            <div v-if="loading" class="loading-text">
                <div class="ui active large centered inline loader text green">Loading Gardens...</div>
            </div>
            <template v-else-if="!loading">
                <div v-if="gardens && gardens.length" class="gardens-list ui link cards">
                    <template v-for="garden in gardens">
                        <garden-item v-bind:garden="garden"></garden-item>
                    </template>
                </div>
                <div class="gardens-empty" v-else-if="gardens && !gardens.length">
                You have no gardens
                </div>
            </template>

        `
    });


    window.app = new Vue({
        el: '#app',
        data: {
            session: false,
            loaded: false
        },
        methods: {
            popup(type) {
                console.log(type);
            },

            getUserSession: async function () {
                const req = await fetch(`/api/session`);
                const res = await req.json();
                return res;
            }
        },

        created: async function () {

            this.getUserSession().then(res => {
                this.session = res.session || false;
                this.loaded = true;
            });
        },

    })
})()
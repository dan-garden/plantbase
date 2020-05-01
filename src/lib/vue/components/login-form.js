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
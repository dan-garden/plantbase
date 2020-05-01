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
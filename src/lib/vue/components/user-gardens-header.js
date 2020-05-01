Vue.component('user-gardens-header', {
    props: ['user_id'],
    template: `
    <div>
        <h2 class="ui icon header center aligned green">
            <i class="circular tree icon"></i>
            <div class="content">
                My Gardens
                <div class="sub header">View your gardens or create a new one</div>
            </div>
        </h2>

        <create-garden v-bind:user_id="user_id"></create-garden>
        <div class="ui divider"></div>
    </div>
    `
});
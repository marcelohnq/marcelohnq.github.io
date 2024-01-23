(function() {
    "use strict";

    const { createApp, ref } = Vue

    createApp({
        data() {
            return {
                spinner: true,
                projects: []
            };
        },
        created () {
            this.fetchProjects();
        },
        methods: {
            async fetchProjects() {
                const response = await fetch("https://api.github.com/users/marcelohnq/starred");
                this.projects = (await response.json()).filter(r => r.owner.login === 'marcelohnq');
                this.spinner = false;
            }
        },
        template: `
            <div v-if="spinner" class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div v-for="project in projects" class="card">
                <div class="card-body">
                    <a href="{{ project.html_url }}" class="card-link"><i class="bi bi-github"></i> Repository</a>
                    <a v-if="project.homepage" href="{{ project.homepage }}" class="card-link"><i class="bi bi-eye"></i> Preview</a>
                    <h5 class="card-title">{{ project.name }}</h5>
                    <p class="card-text">{{ project.description }}</p>
                </div>
            </div>`
    }).mount('#app')
})()
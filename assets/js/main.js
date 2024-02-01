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
            },
            splitDescription(description) {
                const split = description.split("|");
                return split[0];
            },
            splitStack(description) {
                const split = description.split("|");

                if (split.length > 1) {
                    return split[1].split(",");
                }

                return [];
            }
        },
        template: `
            <div v-if="spinner" class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div v-for="(project, key) in projects" 
                 :key="key" 
                 :set="temp = { delay: key*100, description: splitDescription(project.description), stacks: splitStack(project.description) }"
                 class="card" 
                 data-aos="fade-up" 
                 :data-aos-delay="temp.delay">
                <div class="card-body">
                    <a :href="project.html_url" class="card-link"><i class="bi bi-github"></i> Repository</a>
                    <a v-if="project.homepage" :href="project.homepage" class="card-link"><i class="bi bi-eye"></i> Preview</a>
                    <h5 class="card-title">{{ project.name }}</h5>
                    <p class="card-text">{{ temp.description }}</p>
                    <div class="repo-stack">
                        <p v-for="stack in temp.stacks">{{ stack }}</p>
                    </div>
                </div>
            </div>`
    }).mount('#app');

    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        })
    });
})()
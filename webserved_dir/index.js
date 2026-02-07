import { createApp } from 'vue';
import { o_router } from './o_router.js';
import { o_state as o_state__ws, f_connect } from './o_service__websocket.js';
import { o_config__default } from './constructors.module.js';

let o_app = createApp({
    data: function() {
        return {
            o_state__ws: o_state__ws,
            a_o_page: [
                { s_key: 'analyze_file', s_label: 'Analyze Files' },
                { s_key: 'data', s_label: 'Data' },
                { s_key: 'configuration', s_label: 'Configuration' },
            ],
            o_config__default: 
        };
    },
    template: `
        <nav>
            <router-link v-for="o_page in a_o_page" :key="o_page.s_key"
                :to="'/' + o_page.s_key"
                custom
                v-slot="{ navigate, isActive }">
                <button class="nav_item" :class="{ active: isActive }"
                    @click="navigate">
                    {{ o_page.s_label }}
                </button>
            </router-link>
        </nav>

        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>

        <div id="el_status">{{ o_state__ws.s_status }}</div>
    `,
    mounted: function() {
        f_connect();
    },
});
globalThis.o_app = o_app;
o_app.use(o_router);
o_app.mount('#app');

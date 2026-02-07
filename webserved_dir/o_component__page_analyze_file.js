import { o_state as o_state__ws, f_send, f_register_handler } from './o_service__websocket.js';
import { o_component__file_tree } from './o_component__file_tree.js';

let f_add_b_expanded = function(a_o_fsnode) {
    for (let o_fsnode of a_o_fsnode) {
        if (o_fsnode.s_type === 'directory') {
            o_fsnode.b_expanded = false;
            if (o_fsnode.a_o_fsnode) {
                f_add_b_expanded(o_fsnode.a_o_fsnode);
            }
        }
    }
};

let o_component__page_analyze_file = {
    name: 'page-analyze-file',
    components: {
        'file-tree': o_component__file_tree,
    },
    template: `
        <div class="page__content">
            <div class="controls">
                <input type="text" class="input" placeholder="/path/to/directory"
                    v-model="s_path" @keydown.enter="f_scan_directory" />
                <button class="btn" :disabled="!o_state__ws.b_connected"
                    @click="f_scan_directory">f_a_o_fsnode</button>
            </div>
            <div class="container__tree">
                <div v-if="s_error__tree" class="message error">{{ s_error__tree }}</div>
                <div v-else-if="b_loading__tree">loading...</div>
                <file-tree v-else-if="a_o_fsnode.length > 0"
                    :a_o_fsnode="a_o_fsnode" :n_depth="0"></file-tree>
            </div>
        </div>
    `,
    data: function() {
        return {
            o_state__ws: o_state__ws,
            s_path: '',
            a_o_fsnode: [],
            s_error__tree: '',
            b_loading__tree: false,
        };
    },
    methods: {
        f_scan_directory: function() {
            let s_path = this.s_path.trim();
            if (s_path.length === 0) return;
            this.b_loading__tree = true;
            this.s_error__tree = '';
            this.a_o_fsnode = [];
            f_send({ s_type: 'f_a_o_fsnode', s_path: s_path });
        },
        f_handle_message: function(o_data) {
            if (o_data.s_type !== 'f_a_o_fsnode') return;
            this.b_loading__tree = false;
            if (o_data.s_error) {
                this.s_error__tree = o_data.s_error;
                this.a_o_fsnode = [];
                return;
            }
            this.s_error__tree = '';
            f_add_b_expanded(o_data.a_o_fsnode);
            this.a_o_fsnode = o_data.a_o_fsnode;
        },
    },
    created: function() {
        this.f_unregister = f_register_handler(this.f_handle_message);
    },
    beforeUnmount: function() {
        if (this.f_unregister) this.f_unregister();
    },
};

export { o_component__page_analyze_file };

import { createApp, reactive, markRaw } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { 
    a_o_model,
    f_o_toast,
    f_s_name_table__from_o_model,
    o_sfunexposed__f_v_crud__indb,
    a_o_sfunexposed,
    f_o_wsmsg
} from './constructors.module.js';

import {
    f_o_html_from_o_js,
} from "https://deno.land/x/handyhelpers@5.4.2/mod.js"
import { o_component__data } from './o_component__data.js';

let o_state = reactive({
    b_loaded: false,
    a_o_route : [
        {
            path: '/',
            redirect: '/data',
        },
        {
            path: '/data',
            name: 'data',
            component: markRaw(o_component__data),
        },
    ], 
    a_o_model,
    a_o_course: [],
    a_o_student: [],
    o_course_o_student: [],
    a_o_toast: [
        f_o_toast('Welcome to the app!', Date.now(), 5000),
    ],
    n_ts_ms_now: Date.now(),
});

let o_socket = null;
let a_f_handler = [];

let f_register_handler = function(f_handler) {
    a_f_handler.push(f_handler);
    return function() {
        let n_idx = a_f_handler.indexOf(f_handler);
        if (n_idx !== -1) a_f_handler.splice(n_idx, 1);
    };
};

let f_send_wsmsg_with_response = async function(o_wsmsg){
    return new Promise(function(resolve, reject) {
        let f_handler_response = function(o_wsmsg2){
            if(o_wsmsg2.s_uuid === o_wsmsg.s_uuid){
                resolve(o_wsmsg2);
                f_unregister();
            }
        }
        let f_unregister = f_register_handler(f_handler_response);
        o_socket.send(JSON.stringify(o_wsmsg))
    });
}


let f_connect = async function() {
    return new Promise(function(resolve, reject) {
        try {
            let s_protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            o_socket = new WebSocket(s_protocol + '//' + window.location.host);

            o_socket.onopen = async function() {
                o_state.s_status = 'connected';
                o_state.b_connected = true;

                let o_resp = await f_send_wsmsg_with_response(
                    f_o_wsmsg(
                        'hello_from_client',
                        { s_message: 'Hello from client!' }
                    )
                )
                console.log(o_resp)
                resolve();
            };
            
            o_socket.onmessage = function(o_evt) {
                let o_data = JSON.parse(o_evt.data);

                if(o_data?.o_model){
                    let s_name_table = f_s_name_table__from_o_model(o_data.o_model);
                    o_state[s_name_table] = o_data.v_data;
                    return;
                }
                if(o_data.s_type === 'toast'){
                    o_state.a_o_toast.push(o_data.v_data);
                    return;
                }
                for (let f_handler of a_f_handler) {
                    f_handler(o_data);
                }
            };

            o_socket.onclose = function() {
                o_state.s_status = 'disconnected - reconnecting...';
                o_state.b_connected = false;
                setTimeout(f_connect, 2000);
            };
            
        } catch (error) {
            reject(error);
        }
    });
};


await f_connect();



let o_router = createRouter({
    history: createWebHashHistory(),
    routes: o_state.a_o_route,
});






globalThis.o_state = o_state;

setInterval(function(){ o_state.n_ts_ms_now = Date.now(); }, 1000);

let o_app = createApp({
    data: function() {
        return o_state;
    },
    template: 
    (await f_o_html_from_o_js(
        {
            a_o: [
                {
                    class: "nav", 
                    a_o: [
                        {
                            's_tag': "router-link",
                            'v-for': "o_route in a_o_route",
                            ':to': 'o_route.path',
                            innerText: "{{ o_route.path }}",
                        }
                    ]
                },
                {
                    s_tag: "router-view"
                },  
                {
                    s_tag: "div",
                    class: "a_o_toast",
                    a_o: [
                        {
                            s_tag: "div",
                            class: "o_toast",
                            'v-for': "o_toast in a_o_toast",
                            ':class': "{ expired: n_ts_ms_now > o_toast.n_ts_ms_created + o_toast.n_ttl_ms }",
                            innerText: "{{ o_toast.s_message }}",
                        }
                    ]

                }
        ]
    }
    )).innerHTML,
    mounted: function() {
    },
});
globalThis.o_app = o_app;
globalThis.o_state = o_state;

o_app.use(o_router);

o_app.mount('#app');

export {
    o_state, 
    o_socket,
    f_send_wsmsg_with_response
}
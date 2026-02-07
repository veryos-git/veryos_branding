import { reactive } from 'vue';

let o_state = reactive({
    b_connected: false,
    s_status: 'connecting...',
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

let f_send = function(o_data) {
    if (o_socket && o_socket.readyState === WebSocket.OPEN) {
        o_socket.send(JSON.stringify(o_data));
    }
};

let f_connect = function() {
    let s_protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    o_socket = new WebSocket(s_protocol + '//' + window.location.host);

    o_socket.onopen = function() {
        o_state.s_status = 'connected';
        o_state.b_connected = true;
    };

    o_socket.onmessage = function(o_evt) {
        let o_data = JSON.parse(o_evt.data);
        for (let f_handler of a_f_handler) {
            f_handler(o_data);
        }
    };

    o_socket.onclose = function() {
        o_state.s_status = 'disconnected - reconnecting...';
        o_state.b_connected = false;
        setTimeout(f_connect, 2000);
    };
};

export {
    o_state,
    f_connect,
    f_send,
    f_register_handler,
};

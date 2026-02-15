import { f_send_wsmsg_with_response, o_socket, o_state } from './index.js';

import {
    f_o_html_from_o_js,
} from "https://deno.land/x/handyhelpers@5.4.2/mod.js"

import {
    a_o_model,
    f_s_name_table__from_o_model,
    f_o_model__from_s_name_table,
    s_name_prop_id,
    s_name_prop_ts_created,
    s_name_prop_ts_updated,
    o_sfunexposed__f_v_crud__indb,
    f_o_wsmsg
} from './constructors.module.js';


let a_s_name_prop__auto = [s_name_prop_id, s_name_prop_ts_created, s_name_prop_ts_updated];

let o_component__data = {
    name: 'component-data',
    template: (await f_o_html_from_o_js({
        a_o: [
            {
                class: "a_o_model",
                a_o:[
                    {
                        's_tag': "div",
                        ":class": "'o_model' + (o_model2.s_name === o_model?.s_name ? ' active' : '')",
                        'v-for': "o_model2 of o_state.a_o_model",
                        'innerText': "{{ o_model2.s_name }}",
                        'v-on:click': "f_select_model(o_model2)",
                    },
                ]
            },
            {
                's_tag': "form",
                'v-if': "o_model",
                'class': "o_form__create",
                'v-on:submit.prevent': "f_create_instance",
                a_o: [
                    {
                        's_tag': "span",
                        'class': "s_label__create",
                        'innerText': "New {{ o_model.s_name }}",
                    },
                    {
                        's_tag': "div",
                        'class': "a_o_input",
                        a_o: [
                            {
                                's_tag': "label",
                                'v-for': "o_property of a_o_property__editable",
                                'class': "o_input_group",
                                a_o: [
                                    {
                                        's_tag': "span",
                                        'innerText': "{{ o_property.s_name }}",
                                    },
                                    {
                                        's_tag': "input",
                                        ':type': "o_property.s_type === 'number' ? 'number' : 'text'",
                                        ':step': "o_property.s_type === 'number' ? 'any' : undefined",
                                        'v-model': "o_instance__new[o_property.s_name]",
                                        ':placeholder': "o_property.s_name",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        's_tag': "button",
                        'type': "submit",
                        'class': "btn__create",
                        'innerText': "Create",
                    },
                ]
            },
            {
                s_tag: "table",
                'v-if': "o_model",
                'class': "a_o_model_data_table",
                a_o: [
                    {
                        's_tag': "tr",
                        a_o: [
                            {
                                'v-for': "o_property of o_model?.a_o_property",
                                's_tag': "th",
                                innerText: "{{ o_property.s_name }}",
                            },
                            {
                                'innerText': "delete",
                            }
                        ]
                    },
                    {
                        s_tag: 'tr',
                        'v-for': "o_instance in o_state[f_s_name_table__from_o_model(o_model)]",
                        class: "o_instance",
                        a_o: [
                            {
                                'v-for': "o_property of o_model?.a_o_property",
                                's_tag': "td",
                                innerText: "{{ o_instance[o_property.s_name] }}",
                            },
                            {
                                's_tag': "td",
                                'v-on:click': "f_delete_instance(o_instance)",
                                'innerText': "delete",
                            }
                        ]
                    }
                ]
            }

        ]

    })).outerHTML,
    data: function() {
        return {
            o_state: o_state,
            o_model: null,
            o_instance__new: {},
        };
    },
    computed: {
        a_o_property__editable: function() {
            if (!this.o_model) return [];
            return this.o_model.a_o_property.filter(function(o_property) {
                return !a_s_name_prop__auto.includes(o_property.s_name);
            });
        },
    },
    methods:{
        f_s_name_table__from_o_model,
        f_select_model: function(o_model2) {
            this.o_model = o_model2;
            this.o_instance__new = {};
        },
        f_clear_table: async function() {

        },
        f_delete_instance: async function(o_instance) {
            let o_self = this;

            let o_resp = await f_send_wsmsg_with_response(
                f_o_wsmsg(
                    o_sfunexposed__f_v_crud__indb.s_name,
                    ['delete', s_name_table, o_data]
                )
            );
            o_state[s_name_table].push(o_resp.v_result);

        },
        f_create_instance: async function() {
            let o_self = this;
            let o_data = {};
            let s_name_table = f_s_name_table__from_o_model(o_self.o_model);
            for (let o_property of o_self.a_o_property__editable) {
                let v_val = o_self.o_instance__new[o_property.s_name];
                if (o_property.s_type === 'number') {
                    v_val = Number(v_val);
                }
                o_data[o_property.s_name] = v_val;
            }


            let o_resp = await f_send_wsmsg_with_response(
                f_o_wsmsg(
                    o_sfunexposed__f_v_crud__indb.s_name,
                    ['create', s_name_table, o_data]
                )
            );
            o_state[s_name_table].push(o_resp.v_result);
        },
    },
    created: function() {
        console.log(o_state.a_o_model)
    },
    beforeUnmount: function() {
    },
};

export { o_component__data };

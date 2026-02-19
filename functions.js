// Copyright (C) [2026] [Jonas Immanuel Frey] - Licensed under GPLv2. See LICENSE file for details.

// backend utility functions
// add shared server-side helper functions here and import them where needed

import { s_ds } from './runtimedata.js';
import { f_o_model_instance, o_model__o_fsnode } from './localhost/constructors.js';

let f_a_o_fsnode__from_path = async function(s_path, b_recursive = false) {
    let a_o = [];

    if (!s_path) {
        console.error('Invalid path:', s_path);
        return a_o;
    }
    if (!s_path.startsWith(s_ds)) {
        console.error('Path is not absolute:', s_path);
        return a_o;
    }

    try {
        for await (let o_dir_entry of Deno.readDir(s_path)) {
            let s_path_absolute = `${s_path}${s_ds}${o_dir_entry.name}`;

            let o_fsnode = f_o_model_instance(
                o_model__o_fsnode,
                {
                    s_path_absolute,
                    b_folder: o_dir_entry.isDirectory,
                    
                }
            );
            //optionally store fsnode in db 
            // let o_fsnode__fromdb = (f_v_crud__indb('read', s_name_table__fsnode, { s_path_absolute }))?.at(0);
            // if (o_fsnode__fromdb) {
            //     o_fsnode.n_id = o_fsnode__fromdb.n_id;
            // } else {
            //     let o_fsnode__created = f_v_crud__indb('create', s_name_table__fsnode, { s_path_absolute, b_folder: o_dir_entry.isDirectory });
            //     o_fsnode.n_id = o_fsnode__created.n_id;
            // }

            o_fsnode.s_name = o_fsnode.s_path_absolute.split(s_ds).at(-1);
            if (o_dir_entry.isDirectory && b_recursive) {
                o_fsnode.a_o_fsnode = await f_a_o_fsnode__from_path(s_path_absolute, b_recursive);
            }

            a_o.push(o_fsnode);
        }
    } catch (o_error) {
        console.error(`Error reading directory: ${s_path}`, o_error.message);
        console.error(o_error.stack);
    }

    a_o.sort(function(o_a, o_b) {
        if (o_a.b_folder === o_b.b_folder) return (o_a.s_name || '').localeCompare(o_b.s_name || '');
        return o_a.b_folder ? -1 : 1;
    });

    return a_o;
};

export {
    f_a_o_fsnode__from_path
};

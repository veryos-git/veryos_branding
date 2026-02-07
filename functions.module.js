
import {
    f_v_crud__indb,
} from "./database_functions.module.js";
import {
    f_o_model_instance,
    o_model__o_fsnode
} from "./webserved_dir/constructors.module.js";

import {
    s_ds
} from "./webserver_denojs.js";

let f_a_o_fsnode__from_path_recursive = async function(s_path) {
    let a_o = [];

    // to prevent error Error reading directory: /home/jonas/asdf Cannot read properties of undefined (reading 'split')
    // we have to check if s_path is defined and not empty
    if (!s_path) {
        console.error('Invalid path:', s_path);
        return a_o;
    }
    // and we have to check if s_path is absolute, because Deno.readDir only works with absolute paths
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
           
            let o_fsnode__fromdb = (await f_v_crud__indb('read', o_model__o_fsnode, { s_path_absolute }))?.at(0);
            if (o_fsnode__fromdb) {
                o_fsnode.n_id = o_fsnode__fromdb.n_id;
            }else{
                let o_fsnode__created = await f_v_crud__indb('create', o_model__o_fsnode, { s_path_absolute });
                o_fsnode.n_id = o_fsnode__created.n_id; 
            }

            o_fsnode.s_name = o_fsnode.s_path_absolute.split(s_ds).at(-1);
            if (o_dir_entry.isDirectory) {
                o_fsnode.a_o_fsnode = await f_a_o_fsnode__from_path_recursive(s_path_absolute);
            }

            a_o.push(o_fsnode);
        }
    } catch (o_error) {
        console.error(`Error reading directory: ${s_path}`, o_error.message);
        console.error(o_error);
        // show full backtrace of error
        console.error(o_error.stack);
    }

    a_o.sort(function(o_a, o_b) {
        if (o_a.s_type === o_b.s_type) return o_a.s_name.localeCompare(o_b.s_name);
        return o_a.s_type === 'directory' ? -1 : 1;
    });

    return a_o;
};

export {
    f_a_o_fsnode__from_path_recursive,
};

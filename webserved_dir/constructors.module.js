
let f_s_name_table__from_o_model = function(o_model) {
    return 'a_' + o_model.s_name;
}
let f_s_name_foreign_key__from_o_model = function(o_model) {
    return 'n_' + o_model.s_name + '_n_id';
}
let f_o_modprop = function(
    s_name, 
    s_type, 
    f_b_val_valid = function(){return true},
){
    return {
        s_name,
        s_type,
        f_b_val_valid
    }
}
let f_o_model = function({
    s_name,
    a_o_property
}){
    return {
        s_name,
        a_o_property
    }
}
let f_o_model_prop__default_id = function(s_name){
    return f_o_modprop(s_name, 'number', (n_id)=>{
        // id will be undefined or null if the object does not exist in the database, but it will be set to a number if it does exist in the database
        if (n_id === undefined || n_id === null) return true;
        return Number.isInteger(n_id);
    });
}
let f_o_model_instance = function(
    o_model, 
    o_data
){
    //this is the function that creates an instance of a model, it checks if the properties are valid and throws an error if they are not
    // this function should be used to create instances of models 
    let o_instance = {}
    for(let o_model_prop of o_model.a_o_property){
        let value = o_data[o_model_prop.s_name];
        let b_valid = true;
        if(o_model_prop.f_b_val_valid !== undefined){
            b_valid = o_model_prop.f_b_val_valid(value);
        }
        if(!b_valid){
            let s_error = `Invalid value for property ${o_model_prop.s_name}: ${value}
            validator function is: ${o_model_prop.f_b_val_valid.toString()}
            got value : ${value} of type ${typeof value}`;
            throw new Error(s_error);
        }
        o_instance[o_model_prop.s_name] = value;
    }
    
    return o_instance;
}
let o_model__o_config = f_o_model({
    s_name: 'o_config',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_modprop('s_path_last_opened', 'string', (s)=>{return s!==''}),
        f_o_modprop('a_s_filter_extension', 'array'),
    ]
})
let o_model__o_fsnode = f_o_model({
    s_name: 'o_fsnode',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_model_prop__default_id('n_o_fsnode_n_id'),
        f_o_modprop('s_path_absolute', 'string', (s)=>{return s!==''}),
        f_o_modprop('b_folder', 'boolean', (b)=>{return typeof b === 'boolean'}),
    ]
});
let o_model__o_dimensions = f_o_model({
    s_name: 'o_dimensions',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_model_prop__default_id('n_o_fsnode_n_id'),
        f_o_modprop('n_scl_x', 'number'),
        f_o_modprop('n_scl_y', 'number'),
        f_o_modprop('n_trn_x', 'number'),
        f_o_modprop('n_trn_y', 'number'),
        f_o_modprop('n_ms_duration', 'number'),
    ]
});
let o_model__o_video =  f_o_model({
    s_name: 'o_video',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_model_prop__default_id('n_o_fsnode_n_id'),
        f_o_modprop('n_ms_duration', 'number'),
    ]
})
let o_model__o_img = f_o_model({
    s_name: 'o_img',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_model_prop__default_id('n_o_fsnode_n_id'),
    ]
})
let o_model__o_img_area = f_o_model({
    s_name: 'o_img_area',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_model_prop__default_id('n_o_img_n_id'),
        f_o_modprop('n_scl_x', 'number'),
        f_o_modprop('n_scl_y', 'number'),
        f_o_modprop('n_trn_x', 'number'),
        f_o_modprop('n_trn_y', 'number'),
        f_o_modprop('a_s_label', 'array'),
    ]
});
let a_o_model = [
    o_model__o_config,
    o_model__o_fsnode,
    o_model__o_dimensions,
    o_model__o_video,
    o_model__o_img,
    o_model__o_img_area
];


let f_o_model__from_s_name_table = function(s_name_table) {
    return a_o_model.find(function(o_model) {
        return f_s_name_table__from_o_model(o_model) === s_name_table;
    });
};

export {
    o_model__o_config,
    o_model__o_fsnode,
    o_model__o_dimensions,
    o_model__o_video,
    o_model__o_img,
    o_model__o_img_area,
    a_o_model,
    f_s_name_table__from_o_model,
    f_s_name_foreign_key__from_o_model,
    f_o_model_instance,
    f_o_model__from_s_name_table
}
let o_component__file_tree = {
    name: 'file-tree',
    props: ['a_o_fsnode', 'n_depth'],
    template: `
        <div>
            <div v-for="o_fsnode in a_o_fsnode" :key="o_fsnode.s_path_absolute">
                <div :style="{ paddingLeft: n_depth * 20 + 'px' }">
                    <div v-if="o_fsnode.b_folder" class="entry__directory"
                        @click="o_fsnode.b_expanded = !o_fsnode.b_expanded">
                        <span class="indicator">{{ o_fsnode.b_expanded ? 'v' : '>' }}</span>
                        <span>{{ o_fsnode.s_name }}</span>
                    </div>
                    <div v-else class="entry__file">
                        <span class="indicator">\u00a0</span>
                        <span>{{ o_fsnode.s_name }}</span>
                    </div>
                </div>
                <file-tree v-if="o_fsnode.b_folder && o_fsnode.b_expanded"
                    :a_o_fsnode="o_fsnode.a_o_fsnode"
                    :n_depth="n_depth + 1">
                </file-tree>
            </div>
        </div>
    `,
};

export { o_component__file_tree };

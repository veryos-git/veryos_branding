// Copyright (C) 2026 Jonas Immanuel Frey - Licensed under GPLv2. See LICENSE file for details.

import { f_o_html_from_o_js } from "https://deno.land/x/handyhelpers@5.4.2/mod.js"

let o_component__landing = {
    name: 'component-landing',
    template: (await f_o_html_from_o_js({
        class: 'o_component__landing',
        a_o: [
            { s_tag: 'canvas', ref: 'canvas__matrix' },
            { s_tag: 'span', class: 's_title__landing', innerText: 'VeryOS' },
            { s_tag: 'div', ref: 'el__words', class: 'el__words__landing' },
        ]
    })).outerHTML,
    mounted: function() {
        let o_self = this;

        // ── matrix rain ──────────────────────────────────────────────────────

        let o_canvas = o_self.$refs.canvas__matrix;
        let o_ctx    = o_canvas.getContext('2d');
        let n_font_sz = 16;
        let a_n_drop  = [];

        let f_resize = function() {
            o_canvas.width  = window.innerWidth;
            o_canvas.height = window.innerHeight;
            let n_cnt_col = Math.floor(o_canvas.width / n_font_sz);
            a_n_drop = Array.from({ length: n_cnt_col }, function() {
                return Math.floor(Math.random() * -50);
            });
        };
        f_resize();
        window.addEventListener('resize', f_resize);

        let s_chars         = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let s_word__hidden  = 'VeryOS';
        let n_ms__last_word = 0;
        let n_ms__word_cooldown = 4000;

        let f_draw_matrix = function() {
            o_ctx.fillStyle = 'rgba(0,0,0,0.045)';
            o_ctx.fillRect(0, 0, o_canvas.width, o_canvas.height);
            o_ctx.font = n_font_sz + 'px monospace';

            for (let n_idx = 0; n_idx < a_n_drop.length; n_idx++) {
                o_ctx.fillStyle = Math.random() > 0.97 ? '#afffaf' : '#00cc44';
                let s_char = s_chars[Math.floor(Math.random() * s_chars.length)];
                o_ctx.fillText(s_char, n_idx * n_font_sz, a_n_drop[n_idx] * n_font_sz);
                if (a_n_drop[n_idx] * n_font_sz > o_canvas.height && Math.random() > 0.975) {
                    a_n_drop[n_idx] = 0;
                }
                a_n_drop[n_idx]++;
            }

            // ── hidden word flash ─────────────────────────────────────────────
            let n_ms_now = Date.now();
            if (n_ms_now - n_ms__last_word > n_ms__word_cooldown && Math.random() > 0.985) {
                n_ms__last_word = n_ms_now;
                let b_horizontal = Math.random() > 0.5;
                let n_cnt_col = Math.floor(o_canvas.width / n_font_sz);
                let n_cnt_row = Math.floor(o_canvas.height / n_font_sz);
                let n_col = Math.floor(Math.random() * (n_cnt_col - s_word__hidden.length - 2)) + 1;
                let n_row = Math.floor(Math.random() * (n_cnt_row - s_word__hidden.length - 2)) + 2;
                o_ctx.fillStyle = '#e8f0ff';
                for (let n_i = 0; n_i < s_word__hidden.length; n_i++) {
                    if (b_horizontal) {
                        o_ctx.fillText(s_word__hidden[n_i], (n_col + n_i) * n_font_sz, n_row * n_font_sz);
                    } else {
                        o_ctx.fillText(s_word__hidden[n_i], n_col * n_font_sz, (n_row + n_i) * n_font_sz);
                    }
                }
            }
        };

        o_self._n_id__interval = setInterval(f_draw_matrix, 33);

        // ── word animation ────────────────────────────────────────────────────

        let el__words   = o_self.$refs.el__words;
        let a_s_word    = ['building', 'code,', 'that', 'lasts'];
        let n_ms__char  = 75;
        let n_ms__pause = 350;

        let f_show_word = function(n_idx__word) {
            if (n_idx__word >= a_s_word.length) return;

            let el__word       = document.createElement('span');
            el__word.className = 'el__word__landing';
            el__words.appendChild(el__word);

            let s_word      = a_s_word[n_idx__word];
            let n_idx__char = 0;

            let n_id__type = setInterval(function() {
                if (n_idx__char < s_word.length) {
                    el__word.textContent += s_word[n_idx__char];
                    el__word.style.opacity = '1';
                    n_idx__char++;
                } else {
                    clearInterval(n_id__type);
                    setTimeout(function() {
                        f_show_word(n_idx__word + 1);
                    }, n_ms__pause);
                }
            }, n_ms__char);
        };

        setTimeout(function() { f_show_word(0); }, 800);

        o_self._f_resize = f_resize;
    },
    beforeUnmount: function() {
        window.removeEventListener('resize', this._f_resize);
        clearInterval(this._n_id__interval);
    },
};

export { o_component__landing };

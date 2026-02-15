# manually written down first line as a test
2026-02-13 - replaced all string concatenation with template literals in database_functions.module.js
2026-02-13 - implemented recursive f_ensure_default_data that creates db records from nested data structure with many-to-many junction table support
2026-02-13 - stripped all project-specific frontend components and backend code to create a clean starter project (kept only o_component__page_data)
2026-02-15 - added create-new-instance form to data component with inputs for editable properties, API call to f_v_crud__indb, and auto-refresh
2026-02-15 - fixed white page: f_send_wsmsg_with_response wrapped msg in {o_wsmsg} but server expected s_type at top level, so handshake promise never resolved
2026-02-15 - fixed ws onmessage handler using o_request.json() (closed HTTP request) instead of already-parsed websocket o_data
2026-02-15 - fixed sfunexposed: replaced new Function('return '+s_f) with AsyncFunction using named params and injected scope (f_v_crud__indb, Deno)
2026-02-15 - refactored sfunexposed to use ...a_v_arg rest param pattern: s_f bodies use a_v_arg array, client sends v_data as array, server injects scope deps as named params
2026-02-15 - updated all f_v_crud__indb callers to pass s_name_table strings instead of o_model objects (webserver_denojs.js, default_data.module.js)
2026-02-15 - added toast CSS: fixed bottom-right position, dark background, slide-in animation, fade-out on expired class
2026-02-15 - added reactive n_ts_ms_now with setInterval to make toast expired class reactive in Vue

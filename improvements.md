# Improvements

## 1. Environment Variables (.env)

**Problem:** Hardcoded values scattered across files:
- Database path (`./.gitignored/app.db`) in [database_functions.module.js](database_functions.module.js)
- Server port (`8000`) in [webserver_denojs.js](webserver_denojs.js)
- Static files directory (`webserved_dir`) in [webserver_denojs.js](webserver_denojs.js)

**Fix:**
- Create `.env` with all configurable values
- Create `.env.example` as a committed template
- Add `.env` to `.gitignore`
- Load env vars via `Deno.env.get()` (Deno supports this natively)

---

## 2. File Naming — Remove "module" From Filenames

Since ES6 modules are assumed throughout, the word `module` in filenames is redundant noise.

**Backend:**
- `database_functions.module.js` → `database_functions.js`
- `default_data.module.js` → `default_data.js`
- `runtimedata.module.js` → `runtimedata.js`
- `command_api.module.js` → `command_api.js`
- `functions.module.js` → `functions.js`
- `function_testings.module.js` → `function_testings.js`

**Frontend (`webserved_dir/`):**
- `constructors.module.js` → `constructors.js`
- `functions.module.js` → `functions.js`

---

## 3. Deno Configuration File (`deno.json`)

**Problem:** No `deno.json` config file exists. Users must manually type long CLI commands with permission flags and remember which flags are needed.

**Fix:** Add a `deno.json` with tasks and permission declarations:
```json
{
  "tasks": {
    "start": "deno run --allow-net --allow-read --allow-write --allow-env webserver_denojs.js",
    "test": "deno test --allow-net --allow-read --allow-write function_testings.js"
  }
}
```
This lets users simply run `deno task start` and `deno task test`.

---

## 4. Dead/Placeholder Files — Remove or Fill

These files exist but are completely empty, contributing noise to the template:
- [functions.module.js](functions.module.js) (backend) — empty
- [webserved_dir/functions.module.js](webserved_dir/functions.module.js) (frontend) — empty
- [command_api.module.js](command_api.module.js) — empty
- [function_testings.module.js](function_testings.module.js) — incomplete skeleton

**Fix:** Either remove them or fill them with minimal useful starter code with clear comments. Empty files in a template are confusing.

---

## 5. Debug/Test Code Left in Production Path

**Problem:** [webserver_denojs.js](webserver_denojs.js) contains a `setInterval` that broadcasts motivational toast messages to all clients every 5 seconds. This is clearly test/debug code that was never cleaned up.

**Fix:** Do nothing, we keep this as an example of how the server can broadcast servside messages to the client.

---

## 6. Frontend Libraries — CDN vs Local Duplication

**Problem:** The project has both local copies of Vue and Vue Router in `webserved_dir/lib/` (532 KB + 100 KB) AND an import map in `index.html` pointing to unpkg CDN. This is contradictory — pick one strategy.

**Fix:** Choose one approach and remove the other:
- **Local (recommended for offline/air-gapped dev):** Use the local lib files, remove CDN import map
- **CDN:** Delete the lib/ directory entirely, rely on CDN
The current hybrid is wasteful and confusing.

---

## 7. No Update (Edit) Functionality

**Problem:** The CRUD template only implements Create, Read, and Delete in the UI. Update is implemented in the backend (`f_v_crud__indb` supports `'update'`) but there is no frontend interface to edit existing records.

**Fix:** Add an edit row/inline edit mode to `o_component__data.js` so the template demonstrates all four CRUD operations.

---

## 8. WebSocket Reconnection — No Exponential Backoff

**Problem:** [index.js](webserved_dir/index.js) reconnects to WebSocket every 2 seconds unconditionally. If the server is down for a long time, this hammers the connection attempt at full rate indefinitely.

**Fix:** Implement simple exponential backoff (e.g., 1s, 2s, 4s, 8s, cap at 30s) to reduce noise during server downtime.

---

## 9. No Input Validation on CRUD Operations

**Problem:** [database_functions.module.js](database_functions.module.js) accepts data from WebSocket clients and passes it directly into SQLite queries. There is no validation that field names or table names are safe/expected — a client could send arbitrary table names.

**Fix:** Validate `s_name_table` against the known set of models/tables from `constructors.js` before executing any query. Reject unknown table names with an error toast.

---

## 10. Gitignore Pattern is Unconventional

**Problem:** [.gitignore](.gitignore) uses the pattern `*.gitignored*` to ignore the `.gitignored/` directory. This works, but it's an unusual pattern that could accidentally match unintended files.

**Fix:** Replace with the standard explicit directory ignore:
```
.gitignored/
```

---

## 11. No Authentication on WebSocket

**Problem:** Any client who can reach the server can issue arbitrary CRUD operations, including deleting all table data. There is no token, session, or authentication check.

**Fix:** For a template intended to grow into real apps, add at minimum a placeholder comment for auth middleware — e.g., a token check on WebSocket upgrade using a secret from `.env`. Even a stub with a clear `TODO: implement auth` is better than nothing. so make a placeholder comment that auth should be implemented. but since this template is not intended as a shared application it should not yet implement authentication  

---

## 12. Server Name is Runtime-Specific in Filename

**Problem:** `webserver_denojs.js` encodes the runtime name in the filename. If the runtime changes or the file is referenced from imports, this is fragile.

**Fix:** Rename to `webserver.js`

---

## 13. Dependency Locking

**Problem:** No `deno.lock` file exists. The remote dependency `jsr:@db/sqlite@0.11` could change behavior between installs if the package registry updates.

**Fix:** Run `deno cache --lock=deno.lock` to generate a lockfile and commit it, ensuring reproducible installs.

---

## 14. README is Minimal

**Problem:** [readme.md](readme.md) contains almost no content — no setup instructions, no explanation of naming conventions, no list of env vars, no architecture overview.

**Fix:** Expand to include:
- How to install/run (`deno task start`)
- Required env vars (reference `.env.example`)
- Brief explanation of the project structure
- Link to the naming convention section in `CLAUDE.md`

---

## 15. `AI_responses_summaries.md` Should Not Be in the Template

**Problem:** [AI_responses_summaries.md](AI_responses_summaries.md) is a session log of Claude-assisted changes. In a boilerplate/template repo, this is project-specific noise that end users should not inherit.

**Fix:** Add `AI_responses_summaries.md` to `.gitignore`, or keep only a blank file with the header as a placeholder so the CLAUDE.md instruction still works but without the history.

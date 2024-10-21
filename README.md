This projects includes two machines, one for local major machine (`src/` and `server/`) and another for distributed machine (`server_api/`). It relies on ngrok for tunneling the app.

# Running the server

```
npm install
npm run dev
# In another terminal
ngrok http --domain=YOUR_NGROK_DOMAIN 3000
```

Please note to update the server/app.js with the ngrok free link (obtained from distributing machine, e.g., DGXv4).
This projects includes two machines, one for local major machine (`src/` and `server/`) and another for distributed machine (`server_api/`). It relies on ngrok for tunneling the app.

# Install

## On WebUI-Holder Machine `A`

```
git clone git@github.com:doem97/gpu_dashboard.git
cd gpu_dashboard
cp config.default.json config.json
# edit config.json with your server info
npm install
npm run dev
# In another terminal
ngrok http --domain=$YOUR_NGROK_DOMAIN 3000
```

Please note for the `config.json`, the `ip` field should be the ip that directly access-able with ssh-key enabled. The `proxy` field should be the ngrok free link (obtained from distributing machine, *e.g.*, a DGXv4 behind firewall).

## On Distributing Machine `B` (optionial)

This feature is optional. It is useful when you want to monitor the GPU status of a machine `B` that is behind a firewall (not directly ssh-able by `A`).

```
git clone git@github.com:doem97/gpu_dashboard.git
cd gpu_dashboard/server_api
npm install
npm run dev
# (in another terminal)
ngrok http --domain=$YOUR_NGROK_DOMAIN 3200
```

After running the above command, you should be able to obtain a proxy api url for the distributing machine. Please update the `config.json` file on the webui-holder machine `A` with that proxy api url.
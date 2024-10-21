<div align="center">
  <h1>🚀 GPU Dashboard</h1>
  <p><em>A powerful solution for easy deployment and real-time monitoring of distributed GPU servers</em></p>
</div>

<p align="center">
  <a href="https://status.cvmlgpu.org" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Try%20Now-brightgreen?style=for-the-badge&logo=github" alt="Live Demo" />
  </a>
  <a href="https://github.com/doem97/gpu_dashboard/issues">
    <img src="https://img.shields.io/badge/Feedback-Issues-red?style=for-the-badge&logo=github" alt="Feedback" />
  </a>
</p>

---

**GPU Dashboard** is a WebUI for monitoring distributed GPU servers. It offers a simple but beautiful interface to track GPU usage across multiple servers in real-time.

## 🖼️ Preview

<div align="center">
  <img src="https://github.com/user-attachments/assets/69d823de-342e-4335-936b-dad766b15ac2" alt="Dashboard Overview" width="90%">
  <img src="https://github.com/user-attachments/assets/b4d2ef3a-2e9e-4f92-bf0a-0ce5809c7994" alt="GPU History" width="90%">
</div>

# 🛠️ Installation

## 1. WebUI Host (Machine A)

1. Clone the repository:
   ```
   git clone https://github.com/doem97/gpu_dashboard.git
   cd gpu_dashboard
   ```

2. Set up configuration:
   ```
   cp config.default.json config.json
   ```
   Edit `config.json` with your server details.

3. Install dependencies and start the app:
   ```
   npm install
   npm run dev
   ```

4. Set up ngrok tunnel (in a new terminal):
   ```
   ngrok http --domain=YOUR_NGROK_DOMAIN 3000
   ```

Note: In `config.json`, use SSH-accessible IPs for the `ip` field. For `proxy`, use the ngrok URL from the distributing machine (if applicable).

## 2. Distributing Machine (Machine B) - Optional

Only needed for machines behind a firewall.

1. Clone and navigate to the server API:
   ```
   git clone https://github.com/doem97/gpu_dashboard.git
   cd gpu_dashboard/server_api
   ```

2. Install dependencies and start the server:
   ```
   npm install
   npm run dev
   ```

3. Set up ngrok tunnel (in a new terminal):
   ```
   ngrok http --domain=YOUR_NGROK_DOMAIN 3200
   ```

4. Update `config.json` on Machine A with the new ngrok URL as the proxy API URL.

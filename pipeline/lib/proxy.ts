import { ProxyAgent, setGlobalDispatcher } from "undici";

// Node's global fetch ignores HTTPS_PROXY. In managed environments the outbound
// allowlist is enforced at the agent proxy, so any host beyond the default few
// (e.g. api.elevenlabs.io) is only reachable through it. Routing fetch via the
// proxy makes those hosts work. Import this once before any fetch call.
const proxy = process.env.HTTPS_PROXY ?? process.env.https_proxy;
if (proxy) {
  setGlobalDispatcher(new ProxyAgent(proxy));
}

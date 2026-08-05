export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/check") {
      return handleCheck(request);
    }

    // Anything else is a static file request — served from /public
    return env.ASSETS.fetch(request);
  },
};

async function handleCheck(request) {
  const { searchParams } = new URL(request.url);
  let target = (searchParams.get("url") || "").trim();

  if (!target) {
    return json({ error: "Missing url parameter" }, 400);
  }

  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return json({ error: "That doesn't look like a valid URL" }, 400);
  }

  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "IsItDownRightNow/1.0 (uptime checker)" },
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    return json({
      url: parsed.toString(),
      up: response.status < 500,
      status: response.status,
      latency,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const latency = Date.now() - start;
    const timedOut = err.name === "AbortError";

    return json({
      url: parsed.toString(),
      up: false,
      status: null,
      latency,
      error: timedOut ? "Timed out after 10s" : "Unreachable",
    });
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

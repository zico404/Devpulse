import { trackEvent } from "../../../utils/analytics";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const { type, metadata = {}, url } = req.body || {};

  if (!type) {
    return res.status(400).json({ error: "Event type is required" });
  }

  const allowedTypes = ["page_view", "repo_search", "section_view", "error"];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid event type" });
  }

  trackEvent({ type, ip, userAgent, url, metadata });

  return res.status(200).json({ success: true });
}

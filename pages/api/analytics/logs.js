import { requireAdmin } from "../../../utils/auth";
import { getAnalytics } from "../../../utils/analytics";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = requireAdmin(req, res);
  if (!payload) return;

  const timeRange = req.query.range || "24h";
  const data = getAnalytics(timeRange);

  return res.status(200).json(data);
}

import { requireAdmin } from "../../../utils/auth";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = requireAdmin(req, res);
  if (!payload) return;

  return res.status(200).json({ valid: true, email: payload.email, role: payload.role });
}

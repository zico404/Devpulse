import { createToken, checkRateLimit } from "../../../utils/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zicomighty@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zico404";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailMatch = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
  const passMatch = password === ADMIN_PASSWORD;

  if (!emailMatch || !passMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = createToken({ email: ADMIN_EMAIL, role: "admin" });

  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );

  return res.status(200).json({ token, email: ADMIN_EMAIL });
}

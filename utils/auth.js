import crypto from "crypto";

const SECRET = process.env.ADMIN_JWT_SECRET || "dp-admin-secret-k3y!";
const EXPIRY_HOURS = 24;

function base64url(data) {
  return Buffer.from(data).toString("base64url");
}

function base64urlDecode(str) {
  return Buffer.from(str, "base64url").toString("utf8");
}

export function createToken(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = { ...payload, iat: now, exp: now + EXPIRY_HOURS * 3600 };

  const headerEnc = base64url(JSON.stringify(header));
  const payloadEnc = base64url(JSON.stringify(tokenPayload));
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(`${headerEnc}.${payloadEnc}`)
    .digest("base64url");

  return `${headerEnc}.${payloadEnc}.${signature}`;
}

export function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerEnc, payloadEnc, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(`${headerEnc}.${payloadEnc}`)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(base64urlDecode(payloadEnc));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = req.headers.cookie;
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export function requireAdmin(req, res) {
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return payload;
}

const RATE_LIMIT_MAP = new Map();
const RATE_WINDOW = 15 * 60 * 1000;
const RATE_MAX = 10;

export function checkRateLimit(ip) {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

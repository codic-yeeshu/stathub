import arcjet, {detectBot, shield, slidingWindow} from '@arcjet/node';
import { logError } from './utils/utils.js';
const arcjectKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE';

if (!arcjectKey) {
  logError('ARCJET_KEY is not set. Arcjet security is disabled.');
}

export const httpArcjet = arcjectKey ?
  arcjet({
    key: arcjectKey,
    rules: [
      shield({ mode: arcjetMode }),
      detectBot({ mode: arcjetMode, allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'] }),
      slidingWindow({ mode: arcjetMode, interval: '10s', max: 50 })
    ]
  }) : null;


export const wsArcjet = arcjectKey ?
  arcjet({
    key: arcjectKey,
    rules: [
      shield({ mode: arcjetMode }),
      detectBot({ mode: arcjetMode, allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'] }),
      slidingWindow({ mode: arcjetMode, interval: '2s', max: 5 })
    ]

  }) : null;


export function securityMiddleware() {
  return async (req, res, next) => {
    if (!httpArcjet) return next();
    try {
      const arcjetDecision = await httpArcjet.protect(req);

      if (arcjetDecision.isDenied()){
        if (arcjetDecision.reason.isRateLimit()){
          return res.status(429).json({ error: "Too Many Requests. Please try again after sometime." });
        }

        return res.status(403).json({ error: "Forbidden." });
      }

    } catch (error) {
      logError("securityMiddleware:", "Error in Arcjet security middleware", error)
      return res.status(503).json({ error: "Service Unavailable. Please try again later." });
    }

    next();
  }
}


export async function wsSecurityMiddleware(req) {
  if (!wsArcjet) return { success: true };

  try {
    const arcjetDecision = await wsArcjet.protect(req);

    if (arcjetDecision.isDenied()) {
      const { code, reason } = arcjetDecision.reason.isRateLimit() ? { code: 1013, reason: "Too Many Requests. Please try again after sometime." } : { code: 1008, reason: "Forbidden." };

      return { success: false, code, reason };

    }
    return { success: true };
  } catch (error) {

    logError("wsSecurityMiddleware:", "Error in Arcjet WebSocket security middleware", error)
    return { success: false, code: 1011, reason: "Server security error. Please try again later." }

  }
}
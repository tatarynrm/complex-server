export function getBrowserName(userAgent: string) {

  userAgent = userAgent.toLowerCase();

  if (userAgent.includes("edg")) return "Microsoft Edge";
  if (userAgent.includes("opr") || userAgent.includes("opera")) return "Opera";
  if (userAgent.includes("chrome") && !userAgent.includes("chromium")) return "Chrome";
  if (userAgent.includes("firefox")) return "Firefox";
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "Safari";

  return "Unknown";
}

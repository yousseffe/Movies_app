/**
 * Utility function to check if code is running during build time
 */
export function isBuildTime() {
  return process.env.NODE_ENV === "development" || process.env.NEXT_PHASE === "phase-production-build"
}

/**
 * Utility function to check if code is running in production
 */
export function isProduction() {
  return process.env.NODE_ENV === "production"
}


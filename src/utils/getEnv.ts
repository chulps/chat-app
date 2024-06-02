// This function determines the environment based on the current window.location.origin
export default function getEnv(): string {
  // Check the origin of the current window location
  switch (window.location.origin) {
    // If the origin is http://localhost:3000, return 'development'
    case "http://localhost:3000":
      return "development";
    // If the origin is https://chulps.github.io, return 'production'
    case "https://chulps.github.io":
      return "production";
    default:
      return "production";
  }
}

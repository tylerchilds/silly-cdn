import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts";

const PORT = 8080;

const handler = (request) => {
  const url = new URL(request.url);
  // Serve the current directory
  return serveDir(request, {
    fsRoot: ".",
    urlRoot: "", // Set the base URL path if needed (leave empty for root)
    showDirListing: true, // Enable directory listing (optional)
    enableCors: true,     // Enable CORS headers (optional for a CDN)
  });
};

console.log(`HTTP web server running. Access it at: http://localhost:${PORT}/`);

Deno.serve({ port: PORT }, handler);

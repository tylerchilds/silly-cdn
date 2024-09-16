import sharp from "npm:sharp";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";

// Define the sizes for thumbnails
const sizes = [144, 640, 1280, 1920];

// Function to resize the image to different sizes
async function resizeImage(inputPath, outputPath, size) {
  await sharp(inputPath)
    .resize({ width: size, fit: "inside" }) // Resize maintaining aspect ratio
    .toFile(outputPath); // Save the resized image
}

// Function to process each image file found
async function processImage(filePath) {
  console.log(filePath)
  // Mirror the directory structure inside the .cache directory
  for (const size of sizes) {
    const outputPath = join(".cache", size.toString(), filePath); // Use join to construct paths
    await ensureDir(dirname(outputPath)); // Ensure the output directory exists
    await resizeImage(filePath, outputPath, size);
    console.log(`Resized ${filePath} to ${size}px -> ${outputPath}`);
  }
}

// Walk through the current directory and find all .jpg files
for await (const entry of walk(".", { exts: ["JPG"], includeDirs: false })) {
  await processImage(entry.path); // Process each .jpg file
}

console.log("All images resized and mirrored successfully.");


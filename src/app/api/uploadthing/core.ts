import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import sharp from "sharp";

const f = createUploadthing();
const utapi = new UTApi();

export const ourFileRouter = {
  designUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Middleware runs server-side before upload
      // We don't need auth - just return empty metadata
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // SUB-03: Strip EXIF metadata for anonymity
      // 1. Fetch the uploaded file from UploadThing storage
      const response = await fetch(file.ufsUrl);
      const originalBuffer = Buffer.from(await response.arrayBuffer());

      // 2. Process with Sharp: strip EXIF, resize, and compress for web
      const strippedBuffer = await sharp(originalBuffer)
        .rotate() // Auto-orient based on EXIF before stripping
        .resize(1200, 1200, {
          fit: "inside", // Maintain aspect ratio, max 1200px on longest side
          withoutEnlargement: true // Don't upscale small images
        })
        .jpeg({ quality: 80 }) // Compress as JPEG at 80% quality
        .toBuffer();

      // 3. Upload the processed image (always JPEG after compression)
      const fileName = file.name.replace(/\.[^.]+$/, ".jpg");
      const blob = new Blob([strippedBuffer], { type: "image/jpeg" });
      const processedFile = new File([blob], fileName, { type: "image/jpeg" });
      const uploadResult = await utapi.uploadFiles([processedFile]);

      if (!uploadResult[0]?.data?.ufsUrl) {
        throw new Error("Failed to upload processed image");
      }

      // 4. Delete the original (unprocessed) file to save storage
      await utapi.deleteFiles([file.key]);

      // 5. Return the URL of the EXIF-stripped image
      console.log("Upload complete (EXIF stripped):", uploadResult[0].data.ufsUrl);
      return { url: uploadResult[0].data.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

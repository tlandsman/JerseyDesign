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

      // 2. Process with Sharp to strip all EXIF metadata
      // .rotate() auto-orients based on EXIF orientation tag before stripping
      // .toBuffer() without keepMetadata() strips all metadata by default
      const strippedBuffer = await sharp(originalBuffer)
        .rotate() // Auto-orient based on EXIF, prevents rotated images
        .toBuffer();

      // 3. Upload the processed (EXIF-stripped) image
      const blob = new Blob([strippedBuffer], { type: file.type });
      const processedFile = new File([blob], file.name, { type: file.type });
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

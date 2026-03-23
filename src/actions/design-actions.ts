"use server";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import {
  createDesign as createDesignDb,
  deleteDesign as deleteDesignDb,
  deleteAllDesigns as deleteAllDesignsDb,
  getDesigns,
  getDesignById,
} from "@/lib/designs";
import { resetAllVotes } from "@/lib/votes";
import { setPhase } from "@/lib/phase";

const utapi = new UTApi();

export async function createDesignAction(
  imageUrl: string,
  submitterName: string,
  submitterToken: string
) {
  const design = await createDesignDb(imageUrl, submitterName, submitterToken);
  revalidatePath("/");
  revalidatePath("/admin");
  return design;
}

export async function deleteDesignAction(id: number) {
  // Get design to extract file key for UploadThing deletion
  const design = await getDesignById(id);

  if (design) {
    // Extract file key from UploadThing URL
    const match = design.imageUrl.match(/\/f\/([^/?]+)/);
    if (match) {
      await utapi.deleteFiles([match[1]]);
    }
  }

  await deleteDesignDb(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteAllDesignsAction() {
  // Get all designs to extract file keys for UploadThing deletion
  const designs = await getDesigns();

  // Extract file keys from UploadThing URLs
  // URLs are like: https://utfs.io/f/{key} or https://{app}.ufs.sh/f/{key}
  const fileKeys = designs
    .map((d) => {
      const match = d.imageUrl.match(/\/f\/([^/?]+)/);
      return match ? match[1] : null;
    })
    .filter((key): key is string => key !== null);

  // Delete files from UploadThing
  if (fileKeys.length > 0) {
    await utapi.deleteFiles(fileKeys);
  }

  // Delete from database
  await deleteAllDesignsDb();
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function resetEverythingAction() {
  // Delete all designs from UploadThing and DB
  await deleteAllDesignsAction();

  // Delete all votes and results
  await resetAllVotes();

  // Reset phase to submit
  await setPhase("submit");

  revalidatePath("/");
  revalidatePath("/admin");
}

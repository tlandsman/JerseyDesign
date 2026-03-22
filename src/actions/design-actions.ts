"use server";

import { revalidatePath } from "next/cache";
import {
  createDesign as createDesignDb,
  deleteDesign as deleteDesignDb,
  deleteAllDesigns as deleteAllDesignsDb,
} from "@/lib/designs";

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
  await deleteDesignDb(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteAllDesignsAction() {
  await deleteAllDesignsDb();
  revalidatePath("/");
  revalidatePath("/admin");
}

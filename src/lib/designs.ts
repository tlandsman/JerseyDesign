import { db } from "@/db";
import { designs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type Design = typeof designs.$inferSelect;

export async function createDesign(
  imageUrl: string,
  submitterName: string,
  submitterToken: string
): Promise<Design> {
  const [design] = await db
    .insert(designs)
    .values({
      imageUrl,
      submitterName,
      submitterToken,
      submittedAt: new Date(),
    })
    .returning();
  return design;
}

export async function getDesigns(): Promise<Design[]> {
  return db.select().from(designs).orderBy(desc(designs.id));
}

export async function getDesignsForSubmitter(submitterToken: string): Promise<Design[]> {
  return db
    .select()
    .from(designs)
    .where(eq(designs.submitterToken, submitterToken))
    .orderBy(desc(designs.id));
}

export async function getDesignCount(): Promise<number> {
  const allDesigns = await db.select().from(designs);
  return allDesigns.length;
}

export async function getSubmitterDesignCount(submitterToken: string): Promise<number> {
  const submitterDesigns = await db
    .select()
    .from(designs)
    .where(eq(designs.submitterToken, submitterToken));
  return submitterDesigns.length;
}

export async function getDesignById(id: number): Promise<Design | null> {
  const [design] = await db
    .select()
    .from(designs)
    .where(eq(designs.id, id))
    .limit(1);
  return design || null;
}

export async function deleteDesign(id: number): Promise<void> {
  await db.delete(designs).where(eq(designs.id, id));
}

export async function deleteAllDesigns(): Promise<void> {
  await db.delete(designs);
}

/**
 * Script d'import du catalogue depuis un fichier Excel
 * Usage: npx ts-node --project tsconfig.json scripts/import-catalogue.ts <chemin-fichier.xlsx>
 *
 * Format attendu du fichier Excel:
 * Colonnes: Nom | Catégorie | Prix (FCFA) | Stock | Description
 */

import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import path from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ExcelRow {
  Nom: string;
  "Catégorie": string;
  "Prix (FCFA)": number;
  Stock: number;
  Description?: string;
}

async function importCatalogue(filePath: string) {
  console.log(`📂 Reading file: ${filePath}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`📊 Found ${rows.length} rows to import`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      if (!row.Nom || !row["Catégorie"] || !row["Prix (FCFA)"]) {
        console.warn(`⚠️ Skipping row with missing data:`, row);
        skipped++;
        continue;
      }

      // Get or create category
      const categorySlug = slugify(row["Catégorie"]);
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: row["Catégorie"], slug: categorySlug },
      });

      // Create product with unique slug
      const baseSlug = slugify(row.Nom);
      let slug = baseSlug;
      let suffix = 0;

      while (await prisma.product.findUnique({ where: { slug } })) {
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }

      await prisma.product.create({
        data: {
          name: row.Nom,
          slug,
          price: row["Prix (FCFA)"],
          stock: row.Stock ?? 0,
          description: row.Description ?? null,
          categoryId: category.id,
          images: [],
          isActive: true,
        },
      });

      console.log(`✅ Created: ${row.Nom}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating product "${row.Nom}":`, error);
      errors++;
    }
  }

  console.log(`\n📊 Import complete:`);
  console.log(`  ✅ Created: ${created}`);
  console.log(`  ⚠️ Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: npx ts-node scripts/import-catalogue.ts <file.xlsx>");
  process.exit(1);
}

importCatalogue(path.resolve(filePath))
  .catch(console.error)
  .finally(() => prisma.$disconnect());

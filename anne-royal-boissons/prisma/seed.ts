import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  const adminPassword = await bcrypt.hash("Admin@2024!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@anne-royal-boissons.bj" },
    update: {},
    create: {
      name: "Administrateur",
      email: "admin@anne-royal-boissons.bj",
      passwordHash: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  const categoriesData = [
    { name: "Vins", slug: "vins" },
    { name: "Champagnes & Mousseux", slug: "champagnes" },
    { name: "Spiritueux & Whiskies", slug: "spiritueux" },
    { name: "Rhums", slug: "rhums" },
    { name: "Liqueurs & Apéritifs", slug: "liqueurs" },
    { name: "Cannettes & Bières", slug: "cannettes" },
    { name: "Sans Alcool", slug: "sans-alcool" },
  ];
  for (const cat of categoriesData) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: { name: cat.name }, create: cat });
  }
  console.log("✅ Categories:", categoriesData.length);

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  const zones = [
    { name: "Cotonou Centre", department: "Littoral", price: 1000 },
    { name: "Cotonou Périphérie", department: "Littoral", price: 1500 },
    { name: "Abomey-Calavi", department: "Atlantique", price: 2000 },
    { name: "Porto-Novo", department: "Ouémé", price: 2500 },
    { name: "Ouidah", department: "Atlantique", price: 3000 },
    { name: "Bohicon", department: "Zou", price: 5000 },
  ];
  for (const zone of zones) {
    await prisma.deliveryZone.upsert({
      where: { id: `zone-${zone.name.toLowerCase().replace(/\s/g, "-")}` },
      update: { price: zone.price },
      create: zone as never,
    });
  }
  console.log("✅ Zones:", zones.length);

  const img = (f: string) => `/images/products/${f}`;
  // Helper: create product with negotiation prices (displayed = price, floor = ~80% of price)
  const p = (data: { slug: string; name: string; description: string; price: number; stock: number; categoryId: string; images: string[] }) => ({
    ...data,
    displayedPrice: data.price,
    floorPrice: Math.round(data.price * 0.8),
  });

  const products = [
    // CHAMPAGNES
    p({ slug: "freixenet", name: "Freixenet", description: "Cava espagnol pétillant, bulles fines et arômes fruités.", price: 6000, stock: 20, categoryId: catMap["champagnes"], images: [img("champagne-freixenet-6000.jpeg")] }),
    p({ slug: "muscador-champagne", name: "Muscador", description: "Champagne doux et fruité, idéal pour les fêtes.", price: 3000, stock: 30, categoryId: catMap["champagnes"], images: [img("champagne-muscador-3000.jpeg")] }),
    p({ slug: "veuve-du-vernay", name: "Veuve du Vernay", description: "Crémant français élégant, notes de pêche et pomme verte.", price: 8000, stock: 25, categoryId: catMap["champagnes"], images: [img("champagne-veuve-du-vernay-8000.jpeg")] }),
    p({ slug: "moet-chandon", name: "Moët & Chandon", description: "Le champagne de prestige, symbole de célébration mondiale.", price: 4800, stock: 15, categoryId: catMap["champagnes"], images: [img("moet-4800.jpeg")] }),
    p({ slug: "ruinart", name: "Ruinart", description: "La plus ancienne Maison de Champagne, cuvée d exception.", price: 50000, stock: 5, categoryId: catMap["champagnes"], images: [img("ruinart-50000.jpeg")] }),
    // VINS
    p({ slug: "acadjou", name: "Acadjou", description: "Vin rouge corsé aux arômes de fruits rouges mûrs.", price: 4000, stock: 40, categoryId: catMap["vins"], images: [img("acadjou-4000.jpeg")] }),
    p({ slug: "asconi-agor", name: "Asconi Agor", description: "Vin rouge moldave, riche en tanins et en caractère.", price: 4000, stock: 30, categoryId: catMap["vins"], images: [img("asconi-agor-4000.jpeg")] }),
    p({ slug: "barron-romero", name: "Barron Romero", description: "Vin rouge espagnol léger et équilibré.", price: 2000, stock: 50, categoryId: catMap["vins"], images: [img("barron-romero-2000.jpeg")] }),
    p({ slug: "beatrice-dumont", name: "Béatrice Dumont", description: "Vin fruité et élégant, parfait pour les repas.", price: 3500, stock: 35, categoryId: catMap["vins"], images: [img("beatrice-dumont-3500.jpeg")] }),
    p({ slug: "castillo-san-simon", name: "Castillo San Simón", description: "Grand vin espagnol aux tanins soyeux, vieilli en fût de chêne.", price: 10000, stock: 20, categoryId: catMap["vins"], images: [img("vin-castillo-san-simon-10000.jpeg")] }),
    p({ slug: "chateau-marlene", name: "Château Marlène", description: "Vin de château, assemblage harmonieux et fruité.", price: 2500, stock: 45, categoryId: catMap["vins"], images: [img("chateau-marlene-2500.jpeg")] }),
    p({ slug: "cortezano", name: "Cortezano", description: "Vin fortifié espagnol, doux et onctueux.", price: 3000, stock: 30, categoryId: catMap["vins"], images: [img("vin-forfite-cortezano-3000.jpeg")] }),
    p({ slug: "domaine-majeste", name: "Domaine Majesté", description: "Vin rouge élaboré avec soin, notes de fruits noirs et épices.", price: 2500, stock: 50, categoryId: catMap["vins"], images: [img("domaine-majeste-2500.jpeg")] }),
    p({ slug: "jp-chenet", name: "JP Chenet", description: "Vin français populaire, bouteille caractéristique et goût fruité.", price: 3800, stock: 60, categoryId: catMap["vins"], images: [img("jp-chenet-3800.jpeg")] }),
    p({ slug: "legende", name: "Légende", description: "Vin rouge de caractère, idéal pour les grandes tablées.", price: 2500, stock: 40, categoryId: catMap["vins"], images: [img("legende-2500.jpeg")] }),
    p({ slug: "mangoustants", name: "Mangoustants", description: "Vin aux arômes exotiques, original et rafraîchissant.", price: 4000, stock: 25, categoryId: catMap["vins"], images: [img("mangoustants-4000.jpeg")] }),
    p({ slug: "nuit-des-anges-rouge", name: "Nuit des Anges Rouge", description: "Vin rouge romantique aux notes de fruits rouges et vanille.", price: 4000, stock: 40, categoryId: catMap["vins"], images: [img("nuit-des-anges-4000.jpeg")] }),
    p({ slug: "nuit-des-anges-blanc", name: "Nuit des Anges Blanc", description: "Vin blanc délicat, notes florales et agrumes.", price: 4000, stock: 35, categoryId: catMap["vins"], images: [img("vin-blanc-nuit-des-anges-4000.jpeg")] }),
    p({ slug: "revelation", name: "Révélation", description: "Grand vin de prestige, une révélation pour les amateurs.", price: 23000, stock: 10, categoryId: catMap["vins"], images: [img("vin-revelation-23000.jpeg")] }),
    p({ slug: "vinha-da-valentina", name: "Vinha da Valentina", description: "Vin portugais raffiné, bouquet riche et complexe.", price: 15000, stock: 12, categoryId: catMap["vins"], images: [img("vin-vinha-da-valentina-15000.jpeg")] }),
    p({ slug: "vinha-do-fava", name: "Vinha do Fava", description: "Vin rouge portugais fruité et souple en bouche.", price: 2500, stock: 45, categoryId: catMap["vins"], images: [img("vin-rouge-vinha-do-fava-2500.jpeg")] }),
    // RHUMS
    p({ slug: "rhum-saint-james-6500", name: "Rhum Saint James (Petit)", description: "Rhum agricole martiniquais, sucre de canne pur jus.", price: 6500, stock: 30, categoryId: catMap["rhums"], images: [img("rhum-st-james-6500fcfa.jpeg")] }),
    p({ slug: "rhum-saint-james-8500", name: "Rhum Saint James (Grand)", description: "Rhum agricole martiniquais vieilli, ambré et complexe.", price: 8500, stock: 25, categoryId: catMap["rhums"], images: [img("rhum-st-james-8500.jpeg")] }),
    // SPIRITUEUX
    p({ slug: "8-pm-3000", name: "8 PM", description: "Whisky indien doux, parfait pour débuter la soirée.", price: 3000, stock: 40, categoryId: catMap["spiritueux"], images: [img("8-pm-3000.jpeg")] }),
    p({ slug: "8-pm-3500", name: "8 PM (Grand Format)", description: "Whisky indien grand format, doux et accessible.", price: 3500, stock: 35, categoryId: catMap["spiritueux"], images: [img("8-pm-3500.jpeg")] }),
    p({ slug: "after-dark", name: "After Dark", description: "Spiritueux de soirée, notes caramélisées et épicées.", price: 3500, stock: 30, categoryId: catMap["spiritueux"], images: [img("after-dark-3500.jpeg")] }),
    p({ slug: "black-label", name: "Johnnie Walker Black Label", description: "Blended scotch whisky 12 ans, riche et complexe.", price: 21000, stock: 15, categoryId: catMap["spiritueux"], images: [img("black-label-21000.jpeg")] }),
    p({ slug: "blue-finest", name: "Blue Finest", description: "Spiritueux premium, arômes floraux et fruités.", price: 3000, stock: 35, categoryId: catMap["spiritueux"], images: [img("blue-finest-3000.jpeg")] }),
    p({ slug: "bonys", name: "Bony's", description: "Spiritueux léger et facile à boire.", price: 2000, stock: 50, categoryId: catMap["spiritueux"], images: [img("bonys-2000.jpeg")] }),
    p({ slug: "cape-discovery", name: "Cape Discovery", description: "Brandy sud-africain fruité, notes de raisins secs.", price: 4000, stock: 30, categoryId: catMap["spiritueux"], images: [img("cape-discovery-4000.jpeg")] }),
    p({ slug: "capitain-jack", name: "Capitain Jack", description: "Rhum blanc de caractère, sec et aromatique.", price: 2500, stock: 40, categoryId: catMap["spiritueux"], images: [img("capitain-jack-2500.jpeg")] }),
    p({ slug: "chanceler", name: "Chanceler", description: "Spiritueux élégant aux notes boisées.", price: 3000, stock: 35, categoryId: catMap["spiritueux"], images: [img("chanceler-3000.jpeg")] }),
    p({ slug: "chivas-regal", name: "Chivas Regal", description: "Blended scotch whisky de luxe, 12 ans d âge.", price: 22000, stock: 12, categoryId: catMap["spiritueux"], images: [img("chivas-22000.jpeg")] }),
    p({ slug: "chuva-de-prata", name: "Chuva de Prata", description: "Aguardente portugaise légère et rafraîchissante.", price: 1500, stock: 60, categoryId: catMap["spiritueux"], images: [img("chuva-de-prata-1500.jpeg")] }),
    p({ slug: "clan-macgregor", name: "Clan MacGregor", description: "Scotch whisky blended, fruité et légèrement tourbé.", price: 8500, stock: 20, categoryId: catMap["spiritueux"], images: [img("clan-macgregor-8500.jpeg")] }),
    p({ slug: "dimple", name: "Dimple", description: "Scotch whisky premium 15 ans, doux et sophistiqué.", price: 25000, stock: 8, categoryId: catMap["spiritueux"], images: [img("whisky-dimple-25000.jpeg")] }),
    p({ slug: "festival-cross", name: "Festival Cross", description: "Spiritueux festif, léger et agréable.", price: 2500, stock: 45, categoryId: catMap["spiritueux"], images: [img("festival-cross-2500.jpeg")] }),
    p({ slug: "fiesta", name: "Fiesta", description: "Spiritueux festif abordable.", price: 1500, stock: 70, categoryId: catMap["spiritueux"], images: [img("fiesta-1500.jpeg")] }),
    p({ slug: "gordons-gin", name: "Gordon's Gin", description: "London Dry Gin classique, genièvre dominant.", price: 9000, stock: 20, categoryId: catMap["spiritueux"], images: [img("gordons-9000.jpeg")] }),
    p({ slug: "grande", name: "Grande", description: "Spiritueux léger et accessible.", price: 1500, stock: 80, categoryId: catMap["spiritueux"], images: [img("grande-1500.jpeg")] }),
    p({ slug: "grants", name: "Grant's", description: "Blended scotch whisky triple bois.", price: 6500, stock: 25, categoryId: catMap["spiritueux"], images: [img("grants-6500.jpeg")] }),
    p({ slug: "great-napoleon-warrior", name: "Great Napoleon Warrior", description: "Brandy puissant aux notes de fruits secs et épices.", price: 3000, stock: 30, categoryId: catMap["spiritueux"], images: [img("great-napoleon-warrior-3000.jpeg")] }),
    p({ slug: "green-lee", name: "Green Lee", description: "Whisky léger et fruité.", price: 3500, stock: 35, categoryId: catMap["spiritueux"], images: [img("green-lee-3500.jpeg")] }),
    p({ slug: "hennessy", name: "Hennessy", description: "Cognac prestige, symbole de l excellence française.", price: 25000, stock: 10, categoryId: catMap["spiritueux"], images: [img("whisky-hennesy-25000.jpeg")] }),
    p({ slug: "imperial-blue", name: "Imperial Blue", description: "Whisky indien doux, notes de vanille et caramel.", price: 2500, stock: 50, categoryId: catMap["spiritueux"], images: [img("imperial-blue-2500.jpeg")] }),
    p({ slug: "jb-whisky", name: "J&B Whisky", description: "Rare blended scotch whisky, léger et fruité.", price: 8500, stock: 18, categoryId: catMap["spiritueux"], images: [img("jandb-8500.jpeg")] }),
    p({ slug: "jack-daniels", name: "Jack Daniel's", description: "Tennessee whiskey emblématique, charbon de sirop d érable.", price: 21000, stock: 15, categoryId: catMap["spiritueux"], images: [img("jack-daniel-21000.jpeg")] }),
    p({ slug: "lord-and-master", name: "Lord & Master", description: "Whisky accessible, notes boisées légères.", price: 2500, stock: 45, categoryId: catMap["spiritueux"], images: [img("whisky-lord-and-master-2500.jpeg")] }),
    p({ slug: "long-rider", name: "Long Rider", description: "Spiritueux de caractère.", price: 2500, stock: 40, categoryId: catMap["spiritueux"], images: [img("long-rider-2500.jpeg")] }),
    p({ slug: "magic", name: "Magic", description: "Spiritueux léger.", price: 1500, stock: 60, categoryId: catMap["spiritueux"], images: [img("magic-1500.jpeg")] }),
    p({ slug: "old-professor", name: "Old Professor", description: "Whisky sage et équilibré.", price: 2500, stock: 40, categoryId: catMap["spiritueux"], images: [img("old-professor-2500.jpeg")] }),
    p({ slug: "red-label", name: "Johnnie Walker Red Label", description: "Blended scotch whisky iconique, idéal en cocktail.", price: 7000, stock: 25, categoryId: catMap["spiritueux"], images: [img("red-label-7000.jpeg")] }),
    p({ slug: "reserve-7", name: "Reserve 7", description: "Whisky de réserve, arômes ronds et doux.", price: 2500, stock: 40, categoryId: catMap["spiritueux"], images: [img("reserve7-2500.jpeg")] }),
    p({ slug: "royal-circle", name: "Royal Circle", description: "Spiritueux premium, notes royales.", price: 2800, stock: 35, categoryId: catMap["spiritueux"], images: [img("royal-circle-2800.jpeg")] }),
    p({ slug: "ruitz", name: "Ruitz", description: "Spiritueux léger et frais.", price: 2500, stock: 40, categoryId: catMap["spiritueux"], images: [img("ruitz-2500.jpeg")] }),
    p({ slug: "sir-edwards", name: "Sir Edward's Scotch Whisky", description: "Blended scotch whisky, finesse et caractère britannique.", price: 3500, stock: 30, categoryId: catMap["spiritueux"], images: [img("sir-edwards-3500.jpeg")] }),
    p({ slug: "vat-69", name: "VAT 69", description: "Blended scotch whisky historique, équilibré et accessible.", price: 6500, stock: 22, categoryId: catMap["spiritueux"], images: [img("vat-69-6500.jpeg")] }),
    p({ slug: "vodka-18", name: "Vodka 18°", description: "Vodka légère 18°, idéale pour les cocktails festifs.", price: 12000, stock: 20, categoryId: catMap["spiritueux"], images: [img("vody-18-12000-22-13500.jpeg")] }),
    p({ slug: "vodka-22", name: "Vodka 22°", description: "Vodka forte 22°, caractère et puissance.", price: 13500, stock: 15, categoryId: catMap["spiritueux"], images: [img("vody-18-12000-22-13500.jpeg")] }),
    p({ slug: "whytehall", name: "Whytehall Whisky", description: "Blended whisky abordable et agréable.", price: 4000, stock: 30, categoryId: catMap["spiritueux"], images: [img("whisky-whytehall-4000.jpeg")] }),
    p({ slug: "william-lawsons", name: "William Lawson's", description: "Blended scotch whisky, notes fraîches et légèrement fumées.", price: 6500, stock: 25, categoryId: catMap["spiritueux"], images: [img("william-lawsons-6500.jpeg")] }),
    // LIQUEURS
    p({ slug: "achomon", name: "Achomon (1L)", description: "Boisson locale artisanale, 1 litre.", price: 1200, stock: 80, categoryId: catMap["liqueurs"], images: [img("achomon-1l-1200.jpeg")] }),
    p({ slug: "achomon-four", name: "Achomon pour Four (1L)", description: "Achomon spécial four, usage culinaire.", price: 1200, stock: 60, categoryId: catMap["liqueurs"], images: [img("achomon-pour-four-1l-1200.jpeg")] }),
    p({ slug: "arachide", name: "Arachide (1L)", description: "Huile d arachide locale, 1 litre.", price: 1200, stock: 100, categoryId: catMap["liqueurs"], images: [img("arachide-1l-1200.jpeg")] }),
    p({ slug: "baileys-espresso-creme", name: "Baileys Espresso Crème", description: "Liqueur crémeuse irlandaise au café espresso.", price: 11000, stock: 15, categoryId: catMap["liqueurs"], images: [img("whisky-baileys-espresso-creme-11000.jpeg")] }),
    p({ slug: "cacahouete", name: "Cacahouète", description: "Produit local à base de cacahouète.", price: 1200, stock: 100, categoryId: catMap["liqueurs"], images: [img("cacahouete-1200.jpeg")] }),
    p({ slug: "campari", name: "Campari", description: "Bitter italien emblématique, rouge intense et goût amer.", price: 9000, stock: 18, categoryId: catMap["liqueurs"], images: [img("liqueur-campari-9000.jpeg")] }),
    p({ slug: "cointreau", name: "Cointreau", description: "Triple sec à l orange, indispensable dans les grands cocktails.", price: 15000, stock: 12, categoryId: catMap["liqueurs"], images: [img("cointreau-15000.jpeg")] }),
    p({ slug: "du-bonnet", name: "Dubonnet", description: "Apéritif à base de vin liquoreux et quinquina.", price: 6000, stock: 20, categoryId: catMap["liqueurs"], images: [img("du-bonnet-6000.jpeg")] }),
    p({ slug: "flirt", name: "Flirt", description: "Liqueur légère et fruitée.", price: 3500, stock: 35, categoryId: catMap["liqueurs"], images: [img("flirt-3500.jpeg")] }),
    p({ slug: "get-27", name: "Get 27", description: "Liqueur de menthe douce, fraîcheur intense.", price: 15000, stock: 10, categoryId: catMap["liqueurs"], images: [img("get-27-15000.jpeg")] }),
    p({ slug: "liqueur-best", name: "Best Liqueur", description: "Liqueur douce aux arômes variés.", price: 3500, stock: 30, categoryId: catMap["liqueurs"], images: [img("liqueur-best-3500.jpeg")] }),
    p({ slug: "orange-sec", name: "Orange Sec", description: "Liqueur d orange sèche, notes d écorce d orange.", price: 5000, stock: 20, categoryId: catMap["liqueurs"], images: [img("orange-sec-5000.jpeg")] }),
    p({ slug: "sheridans", name: "Sheridan's", description: "Liqueur double à deux couches, café et crème vanillée.", price: 22000, stock: 8, categoryId: catMap["liqueurs"], images: [img("liqueur-sheridans-22000.jpeg")] }),
    p({ slug: "suze", name: "Suze", description: "Apéritif amer à la gentiane, recette française centenaire.", price: 7000, stock: 15, categoryId: catMap["liqueurs"], images: [img("suze-7000.jpeg")] }),
    // CANNETTES
    p({ slug: "heineken-caisse", name: "Heineken (Caisse)", description: "Caisse de cannettes Heineken, bière blonde internationale.", price: 20000, stock: 10, categoryId: catMap["cannettes"], images: [img("cannette-heinken-20000.jpeg")] }),
    // SANS ALCOOL
    p({ slug: "pack-festif-sans-alcool", name: "Pack Festif Sans Alcool", description: "Assortiment festif sans alcool : Chuva de Prata et Cereser.", price: 18000, stock: 10, categoryId: catMap["sans-alcool"], images: [img("festif-sans-alcool-chuva-de-prata-et-cereser-18000.jpeg")] }),
  ];

  let created = 0;
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { name: product.name, price: product.price, displayedPrice: product.displayedPrice, floorPrice: product.floorPrice, images: product.images, categoryId: product.categoryId },
      create: { ...product, isActive: true },
    });
    created++;
  }
  console.log(`✅ Products seeded: ${created}`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

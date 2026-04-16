import {
  accounts,
  categories,
  db,
  members,
  orderItems,
  orders,
  organizations,
  products,
  users,
} from "./index";

const now = new Date();

const USER_ID = crypto.randomUUID();
const ORG_ID = crypto.randomUUID();

const CATEGORY_BEVERAGES = crypto.randomUUID();
const CATEGORY_FOOD = crypto.randomUUID();
const CATEGORY_DESSERTS = crypto.randomUUID();

const PRODUCT_IDS = {
  espresso: crypto.randomUUID(),
  latte: crypto.randomUUID(),
  icedAmericano: crypto.randomUUID(),
  nasiGoreng: crypto.randomUUID(),
  miGoreng: crypto.randomUUID(),
  rotiBakar: crypto.randomUUID(),
  puddingCoklat: crypto.randomUUID(),
  es_krim: crypto.randomUUID(),
};

async function seed() {
  console.log("🌱 Seeding database...");

  // ── User ──────────────────────────────────────────────────────────────────
  const hashedPassword = await Bun.password.hash("password123", {
    algorithm: "bcrypt",
  });

  await db.insert(users).values({
    id: USER_ID,
    name: "Demo Owner",
    email: "demo@qrave.app",
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(accounts).values({
    id: crypto.randomUUID(),
    accountId: USER_ID,
    providerId: "credential",
    userId: USER_ID,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  // ── Organization ──────────────────────────────────────────────────────────
  await db.insert(organizations).values({
    id: ORG_ID,
    name: "Kopi Nusantara",
    slug: "kopi-nusantara",
    createdAt: now,
  });

  await db.insert(members).values({
    id: crypto.randomUUID(),
    organizationId: ORG_ID,
    userId: USER_ID,
    role: "owner",
    createdAt: now,
  });

  // ── Categories ────────────────────────────────────────────────────────────
  await db.insert(categories).values([
    {
      id: CATEGORY_BEVERAGES,
      organizationId: ORG_ID,
      name: "Beverages",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: CATEGORY_FOOD,
      organizationId: ORG_ID,
      name: "Food",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: CATEGORY_DESSERTS,
      organizationId: ORG_ID,
      name: "Desserts",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ── Products ──────────────────────────────────────────────────────────────
  await db.insert(products).values([
    {
      id: PRODUCT_IDS.espresso,
      organizationId: ORG_ID,
      categoryId: CATEGORY_BEVERAGES,
      name: "Espresso",
      description: "Rich and bold single shot espresso",
      price: 18000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.latte,
      organizationId: ORG_ID,
      categoryId: CATEGORY_BEVERAGES,
      name: "Caffe Latte",
      description: "Smooth espresso with steamed milk",
      price: 28000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.icedAmericano,
      organizationId: ORG_ID,
      categoryId: CATEGORY_BEVERAGES,
      name: "Iced Americano",
      description: "Chilled espresso with cold water",
      price: 25000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.nasiGoreng,
      organizationId: ORG_ID,
      categoryId: CATEGORY_FOOD,
      name: "Nasi Goreng",
      description: "Indonesian fried rice with egg and crackers",
      price: 35000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.miGoreng,
      organizationId: ORG_ID,
      categoryId: CATEGORY_FOOD,
      name: "Mie Goreng",
      description: "Indonesian fried noodles with vegetables",
      price: 32000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.rotiBakar,
      organizationId: ORG_ID,
      categoryId: CATEGORY_FOOD,
      name: "Roti Bakar",
      description: "Toasted bread with butter and jam",
      price: 20000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.puddingCoklat,
      organizationId: ORG_ID,
      categoryId: CATEGORY_DESSERTS,
      name: "Pudding Coklat",
      description: "Silky chocolate pudding",
      price: 22000,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: PRODUCT_IDS.es_krim,
      organizationId: ORG_ID,
      categoryId: CATEGORY_DESSERTS,
      name: "Es Krim",
      description: "Two scoops of vanilla ice cream",
      price: 20000,
      isAvailable: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const order1Id = crypto.randomUUID();
  await db.insert(orders).values({
    id: order1Id,
    organizationId: ORG_ID,
    tableNumber: "A1",
    status: "pending",
    total: 28000 + 35000,
    createdAt: now,
  });
  await db.insert(orderItems).values([
    {
      id: crypto.randomUUID(),
      orderId: order1Id,
      productId: PRODUCT_IDS.latte,
      quantity: 1,
      price: 28000,
    },
    {
      id: crypto.randomUUID(),
      orderId: order1Id,
      productId: PRODUCT_IDS.nasiGoreng,
      quantity: 1,
      price: 35000,
    },
  ]);

  const order2Id = crypto.randomUUID();
  await db.insert(orders).values({
    id: order2Id,
    organizationId: ORG_ID,
    tableNumber: "B3",
    status: "completed",
    total: 25000 * 2 + 22000,
    createdAt: now,
  });
  await db.insert(orderItems).values([
    {
      id: crypto.randomUUID(),
      orderId: order2Id,
      productId: PRODUCT_IDS.icedAmericano,
      quantity: 2,
      price: 25000,
    },
    {
      id: crypto.randomUUID(),
      orderId: order2Id,
      productId: PRODUCT_IDS.puddingCoklat,
      quantity: 1,
      price: 22000,
    },
  ]);

  console.log("✅ Seed complete!");
  console.log("");
  console.log("  Cafe slug : kopi-nusantara");
  console.log("  Email     : demo@qrave.app");
  console.log("  Password  : password123");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

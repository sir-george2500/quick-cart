import { PrismaClient, UserRole } from "@prisma/client";
import { RolePermissions } from "../src/shared/enums/permissions.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with default roles...");

  // Create default roles
  const roles = [
    {
      name: UserRole.SUPER_ADMIN,
      description: "Platform super administrator with full access",
      permissions: Object.keys(RolePermissions[UserRole.SUPER_ADMIN]),
    },
    {
      name: UserRole.VENDOR,
      description: "Vendor/seller who can manage their own store and products",
      permissions: RolePermissions[UserRole.VENDOR],
    },
    {
      name: UserRole.CUSTOMER,
      description: "Regular customer who can browse and purchase products",
      permissions: RolePermissions[UserRole.CUSTOMER],
    },
    {
      name: UserRole.SUPPORT,
      description: "Customer support staff with limited admin access",
      permissions: RolePermissions[UserRole.SUPPORT],
    },
  ];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        permissions: roleData.permissions,
        description: roleData.description,
      },
      create: roleData,
    });
    console.log(`✅ Created/Updated role: ${role.name}`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

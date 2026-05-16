import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function seedSampleData(timeSlots) {
  const client1 = await prisma.client.upsert({
    where: { email: "joao@example.com" },
    update: {},
    create: {
      name: "Joao Silva",
      email: "joao@example.com",
      phone: "11999999999",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      name: "Maria Santos",
      email: "maria@example.com",
      phone: "11888888888",
    },
  });

  await prisma.booking.create({
    data: {
      clientId: client1.id,
      timeSlotId: timeSlots[0].id,
      date: new Date("2026-05-10T10:00:00"),
      status: "confirmed",
      value: 150.0,
    },
  });

  await prisma.booking.create({
    data: {
      clientId: client2.id,
      timeSlotId: timeSlots[5].id,
      date: new Date("2026-05-12T15:00:00"),
      status: "pending",
      value: 150.0,
    },
  });

  await prisma.courtImage.create({
    data: {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh_mhuU5QqCkDVd1Clk6pXCpEDoGNgGYBmzlZbfFy17InjJx2HVfreXiSwTEaNdWE5bdAtcilEnDQm9pP_tNFJBYp5Ozmyadww_1Ku2JnOjgNb09pPJpoxGrBbMO5URBf9V6A4UUCr-wUMq7QFAVxhJCDsarIG9qa3yX1hskI61dfPayxw12DLRl7twdGS0c2UixsLxqiZwK6_62y7PGKxM2ZZqGP-3l-Q6nN-om8CwpTj66gCza-EVt1f8qDf_hRC9c9KoHKFj-U",
      title: "Quadra Principal",
      order: 1,
      active: true,
    },
  });

  console.log("Sample data created.");
}

async function main() {
  console.log("Starting database seed...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@tennishouse.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 16) {
    throw new Error(
      "Set ADMIN_PASSWORD with at least 16 characters before running the seed.",
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "Administrador",
      role: "admin",
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Administrador",
      role: "admin",
    },
  });

  const timeSlots = [];
  for (let hour = 5; hour < 23; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

    const slot = await prisma.timeSlot.upsert({
      where: { startTime_endTime: { startTime, endTime } },
      update: {},
      create: {
        startTime,
        endTime,
        price: 150.0,
        available: true,
      },
    });

    timeSlots.push(slot);
  }

  if (process.env.SEED_SAMPLE_DATA === "true") {
    await seedSampleData(timeSlots);
  }

  console.log("Seed completed.");
  console.log(`Admin ready: ${admin.email}`);
  console.log(`Time slots ready: ${timeSlots.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const countries = [
    { name: 'Singapore', countryCode: 'SG', phone: '+65' },
    { name: 'Thailand', countryCode: 'TH', phone: '+66' },
    { name: 'Indonesia', countryCode: 'ID', phone: '+62' },
    { name: 'Philippines', countryCode: 'PH', phone: '+63' },
    { name: 'Malaysia', countryCode: 'MY', phone: '+60' },
    { name: 'Vietnam', countryCode: 'VN', phone: '+84' },
  ]

  for (const country of countries) {
    await prisma.country.upsert({
      where: { countryCode: country.countryCode },
      update: {},
      create: country,
    })
  }

  const superusers = [{
    email: "jervey.benitez@geco.asia",
    name: "Jervey",
    password: "jerveypassword",
    phone: null,
    role: "superadmin" as const,
    active: true,
    countryCodes: ["SG", "TH", "ID", "PH", "MY", "VN"]
  }, {
    email: "tricia.almodiente@geco.asia",
    name: "Tricia Almodiente",
    password: "triciapassword",
    phone: null,
    role: "superadmin" as const,
    active: true,
    countryCodes: ["SG", "TH", "ID", "PH", "MY", "VN"]
  }]
 
  for (const u of superusers) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const countries = await prisma.country.findMany({
      where: { countryCode: { in: u.countryCodes } },
    });

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        hashedPassword,
        role: u.role,
        active: true,
        countriesHandled: {
          connect: countries.map((c) => ({ id: c.id })),
        },
      },
    });
  }

  console.log('Seeded countries ✅')
  console.log("Seeded superadmin ✅");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
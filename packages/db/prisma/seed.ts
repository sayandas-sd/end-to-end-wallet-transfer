import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
  try {
    const alice = await prisma.user.upsert({
      where: { number: '1111111111' },
      update: {},
      create: {
        number: '1111111111',
        password: await bcrypt.hash('alice', 10),
        name: 'alice',
        Balance: {
          create: {
              amount: 20000,
              locked: 0
          }
        },
        OnRampTransaction: {
          create: {
            startTime: new Date(),
            status: "Success",
            amount: 20000,
            token: "token__1",
            provider: "HDFC Bank",
          },
        },
      },
    });

    const bob = await prisma.user.upsert({
      where: { number: '2222222222' },
      update: {},
      create: {
        number: '2222222222',
        password: await bcrypt.hash('bob', 10),
        name: 'bob',
        Balance: {
          create: {
              amount: 2000,
              locked: 0
          }
        },
        OnRampTransaction: {
          create: {
            startTime: new Date(),
            status: "Failure",
            amount: 2000,
            token: "token__2",
            provider: "HDFC Bank",
          },
        },
      },
    });

    console.log({ alice, bob });
  } catch (error) {
    console.error('Error occurred while seeding the database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Seeding completed successfully.'))
  .catch((error) => {
    console.error('Error in the main function:', error);
    process.exit(1);
  });

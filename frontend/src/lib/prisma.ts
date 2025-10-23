import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const nodes = await prisma.nodeLabel.findMany();
  console.log(nodes)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// npx tsx src/lib/prisma.ts

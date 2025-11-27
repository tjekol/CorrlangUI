import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // const nodes = await prisma.edge.findMany();
  // const multiEdge = await prisma.multiEdge.create({
  //   data: {
  //     nodes: {
  //       connect: [
  //         { id: 4 }, { id: 5 },
  //       ]
  //     }
  //   }
  // });
  const multiEdge = await prisma.multiEdge.findMany({
    include: {
      nodes: true
    }
  })
  console.log(JSON.stringify(multiEdge, null, 2))
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

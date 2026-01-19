import { prisma } from '@/lib/prisma'

async function main() {
  const deleteSchema = prisma.schema.deleteMany()
  const deleteNode = prisma.node.deleteMany()
  const deleteAtr = prisma.attribute.deleteMany()
  const deleteEdge = prisma.edge.deleteMany()

  await prisma.$transaction([deleteEdge, deleteAtr, deleteNode, deleteSchema])
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

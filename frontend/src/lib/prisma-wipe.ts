import { prisma } from '@/lib/prisma'

async function main() {
  const deleteSchema = prisma.schema.deleteMany()
  const deleteAction = prisma.action.deleteMany()
  const deleteNode = prisma.node.deleteMany()
  const deleteMethod = prisma.method.deleteMany()
  const deleteAtr = prisma.attribute.deleteMany()
  const deleteEdge = prisma.edge.deleteMany()

  const deleteNodeCons = prisma.nodeConnection.deleteMany()
  const deleteAtrCons = prisma.atrConnection.deleteMany()
  const deleteEdgeCons = prisma.edgeConnection.deleteMany()
  const deleteActionCons = prisma.actionConnection.deleteMany()
  const deleteMethodCons = prisma.methodConnection.deleteMany()

  await prisma.$transaction([deleteNodeCons, deleteAtrCons, deleteEdgeCons, deleteActionCons, deleteMethodCons, deleteEdge, deleteAtr, deleteNode, deleteMethod, deleteAction, deleteSchema])
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

import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // const schemas = await prisma.schema.createMany({
  //   data: [
  //     { title: 'Sales' },
  //     { title: 'Invoices' },
  //     { title: 'HR' }
  //   ]
  // })

  // await prisma.node.deleteMany({})
  // await prisma.attribute.deleteMany({})
  // await prisma.edge.deleteMany({})

  const customer_node = await prisma.node.create({
    data:
      { title: 'Customer', positionX: 0, positionY: 0, schemaID: 1 }
  })
  const customer_ad_node = await prisma.node.create({
    data:
      { title: 'Address', positionX: 0, positionY: 0, schemaID: 1 }
  })

  const client_node = await prisma.node.create({
    data:
      { title: 'Client', positionX: 0, positionY: 0, schemaID: 2 }
  })
  const client_ad_node = await prisma.node.create({
    data:
      { title: 'Address', positionX: 0, positionY: 0, schemaID: 2 }
  })

  const employee_node = await prisma.node.create({
    data:
      { title: 'Employee', positionX: 0, positionY: 0, schemaID: 3 }
  })

  await prisma.attribute.createMany({
    data: [
      { nodeID: customer_node.id, text: 'name', type: 1 },
      { nodeID: customer_ad_node.id, text: 'street', type: 1 },
      { nodeID: client_node.id, text: 'name', type: 1 },
      { nodeID: client_ad_node.id, text: 'streetName', type: 1 },
      { nodeID: client_ad_node.id, text: 'postalCode', type: 2 },
      { nodeID: employee_node.id, text: 'firstName', type: 1 },
      { nodeID: employee_node.id, text: 'lastName', type: 1 },
    ]
  })

  await prisma.edge.createMany({
    data: [
      { srcNodeID: customer_node.id, trgtNodeID: client_node.id, type: 0 },
      { srcNodeID: customer_node.id, trgtNodeID: customer_ad_node.id, type: 1 },
      { srcNodeID: client_node.id, trgtNodeID: client_ad_node.id, type: 1 },
    ]
  })
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

// npx tsx src/lib/prisma-seed.ts

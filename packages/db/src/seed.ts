import { db } from './index'

async function main() {
  // Sellers
  const alice = await db.user.upsert({
    where: { email: 'alice@sellers.test' },
    update: {},
    create: { email: 'alice@sellers.test', handle: 'alicevintage', role: 'seller' }
  })

  const bob = await db.user.upsert({
    where: { email: 'bob@sellers.test' },
    update: {},
    create: { email: 'bob@sellers.test', handle: 'bobscloset', role: 'seller' }
  })

  // Show
  const show = await db.show.create({
    data: { sellerId: alice.id, title: 'Alice’s Vintage Live', status: 'draft' }
  })

  // Items
  const items = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      db.item.create({
        data: {
          sellerId: alice.id,
          showId: show.id,
          title: `Vintage Tee #${i + 1}`,
          desc: 'Single stitch, 90s',
          startingPrice: 1000, // cents
          category: 'tee'
        }
      })
    )
  )

  console.log({ alice, bob, showId: show.id, itemCount: items.length })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
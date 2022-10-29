import { PrismaClient } from '@prisma/client';

import tasuku from 'tasuku';
import { TaskInnerAPI } from 'tasuku';

enum OrderStatus {
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

const db = new PrismaClient();

const PRODUCT_A_ID = 'PRODUCT_A_ID';
const PRODUCT_B_ID = 'PRODUCT_B_ID';
const PRODUCT_C_ID = 'PRODUCT_C_ID';
const PRODUCT_D_ID = 'PRODUCT_D_ID';
const PRODUCT_E_ID = 'PRODUCT_E_ID';
const PRODUCT_F_ID = 'PRODUCT_F_ID';

export function cleanupDb<T extends PrismaClient>(prismaClient: T) {
  return async (task: TaskInnerAPI) => {
    const shouldClearTable = true;

    if (!shouldClearTable) return;

    const tablenamesList = (await prismaClient.$queryRaw`SELECT 
      name as tablename
  FROM 
      sqlite_schema
  WHERE 
      type ='table' AND 
      name NOT LIKE 'sqlite_%';`) as {
      tablename: string;
    }[];

    const tablenames = tablenamesList
      .filter(({ tablename }) => tablename !== '_prisma_migrations')
      .map((t) => t.tablename);

    for (const tablename of tablenames) {
      try {
        await prismaClient.$executeRawUnsafe(
          `DELETE FROM '${tablename}';`
        );
        task.setStatus(`finished cleanup on ${tablename} table`);
      } catch (error) {
        task.setError(
          `failed cleanup ${JSON.stringify(
            error
          )} on ${tablename} table`
        );
      }
    }
  };
}

tasuku('Running seed', async ({ task }) => {
  await task('cleanup db', async (task) => {
    await cleanupDb(db)(task);
  });

  await task('create products', async ({ setOutput, setStatus }) => {
    await db.$transaction(async (tx) => {
      setOutput('creating product a');
      await tx.product.create({
        data: {
          id: PRODUCT_A_ID,
          name: 'PRODUCT_A_NAME',
          price: 10,
        },
      });
      setOutput('created product a');

      setOutput('creating product b');
      await tx.product.create({
        data: {
          id: PRODUCT_B_ID,
          name: 'PRODUCT_B_NAME',
          price: 20,
        },
      });
      setOutput('created product b');

      setOutput('creating product c');
      await tx.product.create({
        data: {
          id: PRODUCT_C_ID,
          name: 'PRODUCT_C_NAME',
          price: 30,
        },
      });
      setOutput('created product c');

      setOutput('creating product d');
      await tx.product.create({
        data: {
          id: PRODUCT_D_ID,
          name: 'PRODUCT_D_NAME',
          price: 40,
        },
      });
      setOutput('created product d');

      setOutput('creating product e');
      await tx.product.create({
        data: {
          id: PRODUCT_E_ID,
          name: 'PRODUCT_E_NAME',
          price: 20,
        },
      });
      setOutput('created product e');

      setOutput('creating product f');
      await tx.product.create({
        data: {
          id: PRODUCT_F_ID,
          name: 'PRODUCT_F_NAME',
          price: 90,
        },
      });
      setOutput('created product f');
    });

    setStatus('create products are completed');
  });

  await task('create orders', async ({ setOutput, setStatus }) => {
    await db.$transaction(async (tx) => {
      setOutput('creating order one');
      await tx.order.create({
        data: {
          status: OrderStatus.PROCESSING,
          orderItems: {
            create: [
              {
                productId: PRODUCT_A_ID,
                quantity: 10,
              },
              {
                productId: PRODUCT_B_ID,
                quantity: 2,
              },
            ],
          },
        },
      });
      setOutput('created order one');

      setOutput('creating order two');
      await tx.order.create({
        data: {
          status: OrderStatus.DELIVERED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_C_ID,
                quantity: 8,
              },
              {
                productId: PRODUCT_D_ID,
                quantity: 1,
              },
              {
                productId: PRODUCT_A_ID,
                quantity: 1,
              },
            ],
          },
        },
      });
      setOutput('created order two');

      setOutput('creating order three');
      await tx.order.create({
        data: {
          status: OrderStatus.DELIVERED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_A_ID,
                quantity: 8,
              },
              {
                productId: PRODUCT_B_ID,
                quantity: 1,
              },
              {
                productId: PRODUCT_C_ID,
                quantity: 9,
              },
            ],
          },
        },
      });
      setOutput('created order three');

      setOutput('creating order four');
      await tx.order.create({
        data: {
          status: OrderStatus.CANCELLED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_A_ID,
                quantity: 8,
              },
              {
                productId: PRODUCT_D_ID,
                quantity: 10,
              },
            ],
          },
        },
      });
      setOutput('created order four');

      setOutput('creating order five');
      await tx.order.create({
        data: {
          status: OrderStatus.DELIVERED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_A_ID,
                quantity: 1,
              },
              {
                productId: PRODUCT_D_ID,
                quantity: 2,
              },
            ],
          },
        },
      });
      setOutput('created order five');

      setOutput('creating order six');
      await tx.order.create({
        data: {
          status: OrderStatus.DELIVERED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_D_ID,
                quantity: 3,
              },
            ],
          },
        },
      });
      setOutput('created order six');

      setOutput('creating order six');
      await tx.order.create({
        data: {
          status: OrderStatus.DELIVERED,
          orderItems: {
            create: [
              {
                productId: PRODUCT_A_ID,
                quantity: 12,
              },
            ],
          },
        },
      });
      setOutput('created order six');

      setStatus('created orders completed');
    });
  });
});

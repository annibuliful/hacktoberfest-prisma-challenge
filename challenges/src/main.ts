import { PrismaClient } from '@prisma/client';
import { deepEqual, equal } from 'assert';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname,time',
    },
  },
});

enum OrderStatus {
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

const PRODUCT_A_ID = 'PRODUCT_A_ID';
const PRODUCT_B_ID = 'PRODUCT_B_ID';
const PRODUCT_C_ID = 'PRODUCT_C_ID';
const PRODUCT_D_ID = 'PRODUCT_D_ID';
const PRODUCT_E_ID = 'PRODUCT_E_ID';
const PRODUCT_F_ID = 'PRODUCT_F_ID';

const prismaClient = new PrismaClient();

async function main() {
  try {
    // TODO: count how many delivered order
    const deliveredCount = await prismaClient;

    equal(deliveredCount, 5);

    // TODO: count how many processing order
    const processingCount = await prismaClient;

    equal(processingCount, 1);

    // TODO: count how many delivered orders that have product a
    const deliveredOrdersCountThatContainProductA =
      await prismaClient;

    equal(deliveredOrdersCountThatContainProductA, 4);

    // TODO: get all products that have price greater than 30
    const productsThatPriceGreaterThanThirty = await prismaClient;

    deepEqual(productsThatPriceGreaterThanThirty, [
      { id: 'PRODUCT_A_ID', name: 'PRODUCT_A_NAME', price: 10 },
      { id: 'PRODUCT_B_ID', name: 'PRODUCT_B_NAME', price: 20 },
      { id: 'PRODUCT_E_ID', name: 'PRODUCT_E_NAME', price: 20 },
    ]);

    // TODO: get all products name that have price less than or equal 30, and select only name
    const productsNameThatPriceLessThanOrEqualThirty =
      await prismaClient;

    deepEqual(productsNameThatPriceLessThanOrEqualThirty, [
      { name: 'PRODUCT_A_NAME' },
      { name: 'PRODUCT_B_NAME' },
      { name: 'PRODUCT_C_NAME' },
      { name: 'PRODUCT_E_NAME' },
    ]);

    logger.info('🙌 Please create PR 🙌');
    logger.info('🎉 Please ask speaker for a sticker 🎉');
  } catch (error) {
    console.log(error);
    logger.error('😱 Please try again 😱');
    logger.trace(
      '😱 Please ask speaker if you have some questions 😱'
    );
  }
}

main();

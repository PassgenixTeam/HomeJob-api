import { QueryRunner, getConnection } from 'typeorm';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('target', target);
    console.log('propertyKey', propertyKey);
    console.log('descriptor', descriptor);

    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const queryRunner: QueryRunner = (
        await getConnection('default')
      ).createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release;
      }
    };
    return descriptor;
  };
}

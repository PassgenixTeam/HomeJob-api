import {
  ClassConstructor,
  plainToClass,
  plainToInstance,
} from 'class-transformer';

export const ResponseTransform =
  <T>(TargetArg: ClassConstructor<T>) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await original.apply(this, args);

      return plainToInstance(TargetArg, result, {
        excludeExtraneousValues: true,
      });
    };

    return descriptor;
  };

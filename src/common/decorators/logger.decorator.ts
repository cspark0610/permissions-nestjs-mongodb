export function Logger() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetlMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${propertyKey} with`, args);
      const result = targetlMethod.apply(this, args);
      console.log(`${propertyKey} returned`, result);
      return result;
    };
    return descriptor;
  };
}

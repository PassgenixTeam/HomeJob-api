import { snakeCase } from 'lodash';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  // Convert camelCase to snake_case
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    const snakeCased = snakeCase(
      embeddedPrefixes.concat(customName || propertyName).join('_'),
    );
    return snakeCased.startsWith('_') ? snakeCased.substring(1) : snakeCased;
  }

  // Convert camelCase to snake_case
  relationName(propertyName: string): string {
    const snakeCased = snakeCase(propertyName);
    return snakeCased.startsWith('_') ? snakeCased.substring(1) : snakeCased;
  }

  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  // Convert camelCase to snake_case
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  // Convert camelCase to snake_case
  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
        '_' +
        firstPropertyName.replace(/\./gi, '_') +
        '_' +
        secondTableName,
    );
  }

  // Convert camelCase to snake_case
  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(tableName + '_' + (columnName || propertyName));
  }

  // Convert camelCase to snake_case
  // classTableInheritanceParentColumnName(
  //   parentTableName: string,
  //   parentTableIdPropertyName: string,
  // ): string {
  //   return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  // }
}

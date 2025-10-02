import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export const conditionUtils = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
    }
  });
  return queryBuilder;
};

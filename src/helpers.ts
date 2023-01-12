import { Category } from './types/category';
import { User } from './types/User';

export function findOwner(id: number, usersArr: User[]): User | undefined {
  return usersArr.find(user => user.id === id);
}

export function findFullCategory(
  categoryId: number,
  categoriesArr: Category[],
  usersArr: User[],
): Category | undefined {
  let categoryResult = categoriesArr
    .find(category => category.id === categoryId);

  if (categoryResult) {
    categoryResult = {
      ...categoryResult,
      owner: findOwner(categoryResult.ownerId, usersArr),
    };
  }

  return categoryResult;
}

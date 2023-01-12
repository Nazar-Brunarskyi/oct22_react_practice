import { FC } from 'react';
import cn from 'classnames';
import { Category } from '../types/category';

interface Props {
  category: Category
  selectedCategories: number[];
  onSelect: React.Dispatch<React.SetStateAction<number[]>>,
}

export const CategoryComponent: FC<Props> = ({
  category,
  selectedCategories,
  onSelect,
}) => {
  const {
    title,
    id,
  } = category;

  const isSelected = selectedCategories.includes(id);

  const handleCategorySelect = (idOfCategory: number) => {
    onSelect(currentSelectedCategories => {
      return [...currentSelectedCategories, idOfCategory];
    });
  };

  return (
    <a
      data-cy="Category"
      className={cn('button mr-2 my-1', { 'is-info': isSelected })}
      href={`#/${title}`}
      onClick={() => handleCategorySelect(id)}
    >
      {title}
    </a>
  );
};

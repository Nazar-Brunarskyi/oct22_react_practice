import cn from 'classnames';
import { FC } from 'react';
import { Product } from '../types/product';

interface Props {
  product: Product,
}

export const ProductComponent: FC<Props> = ({ product }) => {
  const {
    id,
    name,
    category,
  } = product;

  if (!category) {
    return <></>;
  }

  const {
    title,
    owner,
    icon,
  } = category;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      <td data-cy="ProductCategory">{`${icon} - ${title}`}</td>

      <td
        data-cy="ProductUser"
        className={cn({
          'has-text-link': owner?.sex === 'm',
          'has-text-danger': owner?.sex === 'f',
        })}
      >
        {owner?.name}
      </td>
    </tr>
  );
};

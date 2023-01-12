import { FC } from 'react';
import cn from 'classnames';
import { User } from '../types/User';

interface Props {
  user: User,
  selectedUser: number,
  onSelect: React.Dispatch<React.SetStateAction<number>>,
}

export const UserComponent: FC<Props> = ({
  user,
  selectedUser,
  onSelect,
}) => {
  const handleSelect = (id: number) => {
    onSelect(id);
  };

  return (
    <a
      data-cy="FilterUser"
      href={`#/${user.name}`}
      className={cn({ 'is-active': selectedUser === user.id })}
      onClick={() => handleSelect(user.id)}
    >
      {user.name}
    </a>
  );
};

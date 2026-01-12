import React from 'react';

import { cn } from '@/helpers/helpers';
import HubPageShell from '@/templates/HubPageShell';

type UserHubPageShellProps = React.ComponentProps<typeof HubPageShell>;

const UserHubPageShell: React.FC<UserHubPageShellProps> = ({
  className,
  maxWidthClassName = 'max-w-7xl',
  ...props
}) => (
  <HubPageShell
    {...props}
    maxWidthClassName={maxWidthClassName}
    className={cn(
      // soft, user-hub themed background
      'bg-[radial-gradient(1000px_circle_at_10%_0%,rgba(251,113,133,0.12)_0%,rgba(255,255,255,0)_55%),radial-gradient(900px_circle_at_90%_10%,rgba(239,122,102,0.10)_0%,rgba(255,255,255,0)_50%)]',
      className,
    )}
  />
);

export default UserHubPageShell;

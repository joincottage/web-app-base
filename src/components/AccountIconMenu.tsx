import { UserProfile } from '@auth0/nextjs-auth0';
import React from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

interface OwnProps {
  style?: any;
  user: UserProfile;
}

export const AccountIconMenu = ({ user, style }: OwnProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        color="inherit"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar alt="Account" src={user.picture || ''} aria-haspopup="true" style={style} />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link href="/account/profile" passHref={true}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <Link href="/api/auth/logout" passHref={true}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

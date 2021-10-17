import { UserProfile } from '@auth0/nextjs-auth0';
import React from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HelpIcon from '@material-ui/icons/Help';
import { IconButton } from '@material-ui/core';

interface OwnProps {
  style?: any;
}

export default function HelpMenu({ style }: OwnProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: 'white' }}
      >
        <HelpIcon style={{ cursor: 'pointer' }} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <a
          target="_blank"
          href="https://docs.joincottage.com"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <MenuItem onClick={handleClose}>Documentation</MenuItem>
        </a>
        <Link href="/" passHref={true}>
          <MenuItem onClick={handleClose}>Report an issue</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

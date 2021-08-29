import { UserProfile } from '@auth0/nextjs-auth0';
import { Fragment } from 'react';
import Link from 'next/link';
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// export const AccountIconMenu1 = ({ user }: { user: UserProfile }) => {
//   return (
//     <Menu as="div" className={`ml-3 relative`}>
//       <div>
//         <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
//           <span className="sr-only">Open user menu</span>
//           <img
//             className="h-8 w-8 rounded-full"
//             src={user.picture || ''} // todo default profile icon
//             alt="img"
//           />
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <DropdownItem href="/account/profile">Profile</DropdownItem>
//           <DropdownItem href="/api/auth/logout">Sign out</DropdownItem>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// };

export const AccountIconMenu = ({ user }: { user: UserProfile }) => {
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
        Account
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
        <Link href="/account/profile" passHref={true}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

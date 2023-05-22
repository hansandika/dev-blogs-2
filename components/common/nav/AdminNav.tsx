import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import Logo from '../Logo';
import { RiMenuFoldFill, RiMenuUnfoldFill } from 'react-icons/ri'
import { IconType } from 'react-icons/lib';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Props {
  navItems: {
    label: string,
    icon: IconType,
    href: string,
  }[]
}

const NAV_OPEN_WIDTH = 'w-60';
const NAV_CLOSE_WIDTH = 'w-12';
const NAV_VISIBILITY = 'nav-visibility'

const AdminNav: FC<Props> = ({ navItems }): JSX.Element => {
  const [visible, setVisible] = useState(true);
  const navRef = useRef<HTMLElement>(null);

  const toggleNav = (visibility: boolean) => {
    const currentNav = navRef.current;
    if (!currentNav) {
      return;
    }

    const { classList } = currentNav;

    if (visibility) {
      // show nav
      classList.remove(NAV_CLOSE_WIDTH);
      classList.add(NAV_OPEN_WIDTH);
    } else {
      // hide nav
      classList.remove(NAV_OPEN_WIDTH);
      classList.add(NAV_CLOSE_WIDTH);
    }
  }

  const updateNavState = () => {
    const newVisibility = !visible;
    console.log(newVisibility);
    toggleNav(newVisibility);
    setVisible(newVisibility);
    localStorage.setItem(NAV_VISIBILITY, JSON.stringify(newVisibility));
  }

  useEffect(() => {
    const navState = localStorage.getItem(NAV_VISIBILITY);
    if (navState !== null) {
      const navStateBool = JSON.parse(navState);
      setVisible(navStateBool);
      toggleNav(navStateBool);
    } else {
      setVisible(true);
    }
  });

  return <nav ref={navRef} className='sticky top-0 flex flex-col justify-between h-screen overflow-hidden shadow-sm w-60 bg-secondary-light dark:bg-secondary-dark transition-width'>
    <div>
      {/* Logo */}
      <Link href='/admin' className='flex items-center p-3 mb-10 space-x-2'>
        <Logo className='w-5 h-5 fill-highlight-light dark:fill-highlight-dark' />
        {visible && <span className='text-xl font-semibold leading-none text-highlight-light dark:text-highlight-dark'>Admin</span>}
      </Link>

      {/* Nav Items */}
      <div className='space-y-6'>
        {navItems.map((navItem) => {
          return <Tippy key={navItem.href} content={navItem.label}>
            <Link href={navItem.href} className='flex items-center text-xl text-highlight-light dark:text-highlight-dark p-3 hover:scale-[0.98] transition'>
              <navItem.icon size={24} />
              {visible && <span className='ml-2 leading-none'>{navItem.label}</span>}
            </Link>
          </Tippy>
        })}
      </div>
    </div>



    {/* Nav Toggler (button) */}
    <button onClick={updateNavState} className="text-highlight-light dark:text-highlight-dark p-3 hover:scale-[0.98] transition self-end">
      {visible ? <RiMenuFoldFill size={25} /> : <RiMenuUnfoldFill size={25} />}
    </button>
  </nav>;
};

export default AdminNav;
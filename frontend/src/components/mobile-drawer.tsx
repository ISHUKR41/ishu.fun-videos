'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdClose,
  MdHome,
  MdVideoLibrary,
  MdOndemandVideo,
  MdWhatshot,
  MdExplore,
  MdAutoAwesome,
} from 'react-icons/md';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/', label: 'Home', icon: MdHome },
  { href: '/categories', label: 'Categories', icon: MdVideoLibrary },
  { href: '/watch/featured-launch-film', label: 'Watch', icon: MdOndemandVideo },
  { href: '/categories/trending-moments', label: 'Trending', icon: MdWhatshot },
  { href: '/categories/highlights', label: 'Explore', icon: MdExplore },
  { href: '/categories/creative-content', label: 'Inspire', icon: MdAutoAwesome },
];

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.nav
            className="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            aria-label="Mobile navigation"
          >
            <div className="drawer-header">
              <span className="drawer-title">Navigation</span>
              <button
                className="drawer-close"
                onClick={onClose}
                aria-label="Close menu"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="drawer-links">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="drawer-link"
                    onClick={onClose}
                  >
                    <item.icon size={22} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="drawer-footer">
              <p>ISHU.FUN — Admin-Curated Platform</p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

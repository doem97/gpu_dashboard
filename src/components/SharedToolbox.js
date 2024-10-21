import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTelegram, FaDownload } from 'react-icons/fa';

const SharedToolbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDownload = () => {
        const fileUrl = process.env.PUBLIC_URL + '/tg_notification.md';
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="relative mr-4" ref={menuRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
            >
                <FaDownload className="w-6 h-6" />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                        <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <motion.button
                                whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                                whileTap={{ backgroundColor: 'var(--active-bg)' }}
                                transition={{ duration: 0.1 }}
                                onClick={handleDownload}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-75"
                                style={{
                                    '--hover-bg': 'rgba(229, 231, 235, 0.1)',
                                    '--active-bg': 'rgba(209, 213, 219, 0.2)',
                                }}
                                role="menuitem"
                            >
                                <FaTelegram className="mr-3 w-5 h-5 text-gray-400 dark:text-gray-400" />
                                <span className="whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                    实验结束自动发送 Telegram 消息
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SharedToolbox;

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTelegram, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const menuItems = [
    {
        icon: FaTelegram,
        label: '实验结束自动发送 Telegram 消息',
        description: '在训练完成时获取即时通知',
        action: 'download',
    },
    // 可以轻松添加更多工具项
];

const SharedToolbox = () => {
    const handleDownload = () => {
        const fileUrl = process.env.PUBLIC_URL + '/tg_notification.md';
        window.open(fileUrl, '_blank');
    };

    return (
        <Menu as="div" className="relative inline-block text-left z-50">
            {({ open }) => (
                <>
                    <Menu.Button
                        as={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl
                                 bg-gradient-to-r from-blue-500 to-blue-600
                                 text-white shadow-lg shadow-blue-500/30
                                 hover:from-blue-600 hover:to-blue-700
                                 focus:outline-none
                                 transition-all duration-200"
                    >
                        <HiSparkles className="w-5 h-5 mr-2" />
                        <span className="font-medium">Toolbox</span>
                        <FaChevronDown
                            className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'transform rotate-180' : ''
                                }`}
                        />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-3 w-96 rounded-2xl
                                             bg-white dark:bg-gray-800 shadow-xl
                                             ring-1 ring-black ring-opacity-5
                                             dark:ring-gray-700 focus:outline-none
                                             divide-y divide-gray-100 dark:divide-gray-700
                                             transform origin-top-right
                                             z-50">
                            <div className="p-2">
                                {menuItems.map((item, index) => (
                                    <Menu.Item key={index}>
                                        {({ active }) => (
                                            <motion.button
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={item.action === 'download' ? handleDownload : undefined}
                                                className={`${active
                                                    ? 'bg-blue-50 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-200'
                                                    } group flex w-full items-center rounded-xl px-3 py-3 text-sm transition-colors duration-150`}
                                            >
                                                <span className={`${active ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                    } rounded-lg p-2 transition-colors duration-150`}>
                                                    <item.icon className="w-5 h-5" />
                                                </span>
                                                <div className="ml-3 text-left">
                                                    <p className="font-medium">{item.label}</p>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default SharedToolbox;

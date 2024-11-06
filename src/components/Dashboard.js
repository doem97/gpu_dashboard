import React, { useState, useEffect } from 'react';
import ServerCard from './ServerCard';
import SharedToolbox from './SharedToolbox';
import ServerHistoryDashboard from './ServerHistoryDashboard';
import ViewCounter from './ViewCounter';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { HiServer } from 'react-icons/hi';

const Dashboard = () => {
    const [servers, setServers] = useState([]);
    const [pinnedServerCards, setPinnedServerCards] = useState(() => {
        const saved = localStorage.getItem('pinnedServerCards');
        return saved ? JSON.parse(saved) : [];
    });

    const [pinnedHistoryCards, setPinnedHistoryCards] = useState(() => {
        const saved = localStorage.getItem('pinnedHistoryCards');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        axios.get('/api/servers')
            .then(response => {
                setServers(response.data);
            })
            .catch(error => {
                console.error('Error fetching servers:', error);
                toast.error('Failed to load servers');
            });
    }, []);

    const toggleServerCardPin = (serverName) => {
        setPinnedServerCards((prev) => {
            const newPinnedServers = prev.includes(serverName)
                ? prev.filter((name) => name !== serverName)
                : [...prev, serverName];
            localStorage.setItem('pinnedServerCards', JSON.stringify(newPinnedServers));

            // Show a toast notification
            if (newPinnedServers.includes(serverName)) {
                toast.success(`${serverName} card pinned to top`);
            } else {
                toast.info(`${serverName} card unpinned`);
            }

            return newPinnedServers;
        });
    };

    const toggleHistoryCardPin = (serverName) => {
        setPinnedHistoryCards((prev) => {
            const newPinnedHistories = prev.includes(serverName)
                ? prev.filter((name) => name !== serverName)
                : [...prev, serverName];
            localStorage.setItem('pinnedHistoryCards', JSON.stringify(newPinnedHistories));

            // Show a toast notification
            if (newPinnedHistories.includes(serverName)) {
                toast.success(`${serverName} history pinned to top`);
            } else {
                toast.info(`${serverName} history unpinned`);
            }

            return newPinnedHistories;
        });
    };

    const sortedServers = [...servers].sort((a, b) => {
        const aIsPinned = pinnedServerCards.includes(a.name);
        const bIsPinned = pinnedServerCards.includes(b.name);
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        return 0;
    });

    const titleVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <motion.div
                        className="flex items-center gap-3"
                        variants={titleVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <HiServer className="w-8 h-8 text-blue-500" />
                        <h1 className={`
                            text-2xl md:text-4xl font-bold tracking-tight
                            bg-clip-text text-transparent drop-shadow-sm
                            dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600
                            bg-gradient-to-r from-slate-700 to-slate-900
                            hover:scale-102 transition-transform duration-200
                        `}>
                            CVML Dashboard
                        </h1>
                    </motion.div>
                    <SharedToolbox />
                </div>
                <AnimatePresence>
                    {sortedServers.map((server) => (
                        <motion.div
                            key={server.name}
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <ServerCard
                                server={server}
                                isPinned={pinnedServerCards.includes(server.name)}
                                onTogglePin={() => toggleServerCardPin(server.name)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <ServerHistoryDashboard
                    servers={servers}
                    pinnedServers={pinnedHistoryCards}
                    onTogglePin={toggleHistoryCardPin}
                />

                <div className="mt-8 flex justify-end">
                    <ViewCounter />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
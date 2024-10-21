import React, { useState, useEffect } from 'react';
import GPUCard from './GPUCard';
import { MdPushPin } from 'react-icons/md';
import { motion } from 'framer-motion';

const fetchGPUData = async (serverName) => {
    try {
        console.log(`Fetching GPU data for ${serverName}`);
        const response = await fetch(`/api/gpu-data?serverName=${encodeURIComponent(serverName)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch GPU data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching GPU data:', error);
        throw error;
    }
};

const ServerCard = ({ server, isPinned, onTogglePin }) => {
    const [gpuData, setGpuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchGPUData(server.name);
                setGpuData(Array.isArray(data) ? data : []); // Ensure gpuData is always an array
            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('Failed to fetch GPU data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [server.name]);

    const cardVariants = {
        pinned: {
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(59, 130, 246, 0.5)",
            zIndex: 10,
        },
        unpinned: {
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(229, 231, 235, 0.5)",
            zIndex: 0,
        }
    };

    if (isLoading) {
        return <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 text-gray-800 dark:text-white animate-pulse">Connecting with {server.name}...</div>;
    }

    if (error) {
        return <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 text-red-500 dark:text-red-400">Error: {error}</div>;
    }

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
            variants={cardVariants}
            animate={isPinned ? "pinned" : "unpinned"}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mr-3">{server.name}</h2>
                    <span className="inline-block text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-.5 rounded-full mt-.5">
                        {server.ip}
                    </span>
                </div>
                <motion.button
                    onClick={onTogglePin}
                    className={`p-2 rounded-full transition-colors duration-200 ${isPinned
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MdPushPin size={18} className={isPinned ? 'fill-current' : ''} />
                </motion.button>
            </div>
            {gpuData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 -mx-3 sm:-mx-0">
                    {gpuData.map((gpu) => (
                        <div key={gpu.index}>
                            <GPUCard gpu={gpu} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">Unable to fetch GPU data. Please check server connection.</p>
            )}
        </motion.div>
    );
};

export default ServerCard;

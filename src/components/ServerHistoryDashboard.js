import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { MdPushPin } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { HiOutlineClock, HiOutlineCalendarDays, HiOutlineChartBar } from 'react-icons/hi2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ToggleSwitch = ({ isSevenDays, onToggle }) => (
    <div className="flex items-center gap-2">
        <Switch.Group as="div" className="flex items-center gap-3">
            <Switch.Label
                className={`text-sm font-medium cursor-pointer transition-colors duration-200
                    ${!isSevenDays ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
            >
                <div className="flex items-center gap-1">
                    <HiOutlineClock className="w-4 h-4" />
                    24h
                </div>
            </Switch.Label>

            <Switch
                checked={isSevenDays}
                onChange={onToggle}
                className={`
                    relative inline-flex h-6 w-[52px] shrink-0 cursor-pointer rounded-full
                    border-2 border-transparent transition-colors duration-200 ease-in-out
                    ${isSevenDays ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                `}
            >
                <span className="sr-only">Toggle view</span>
                <span
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full
                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                        ${isSevenDays ? 'translate-x-[28px]' : 'translate-x-0'}
                    `}
                />
            </Switch>

            <Switch.Label
                className={`text-sm font-medium cursor-pointer transition-colors duration-200
                    ${isSevenDays ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
            >
                <div className="flex items-center gap-1">
                    <HiOutlineCalendarDays className="w-4 h-4" />
                    7d
                </div>
            </Switch.Label>
        </Switch.Group>
    </div>
);

const ServerHistoryDashboard = ({ servers, pinnedServers, onTogglePin }) => {
    const [serverHistories, setServerHistories] = useState({});
    const [isSevenDays, setIsSevenDays] = useState(false);

    useEffect(() => {
        const fetchServerHistories = async () => {
            const histories = {};
            for (const server of servers) {
                try {
                    const response = await fetch(`/api/server-history?ip=${server.ip}`);
                    const data = await response.json();
                    histories[server.ip] = data;
                } catch (error) {
                    console.error(`Error fetching history for ${server.ip}:`, error);
                }
            }
            setServerHistories(histories);
        };

        fetchServerHistories();
    }, [servers]);

    const getChartData = (serverIp) => {
        const history = serverHistories[serverIp] || [];
        const now = new Date();
        const labels = [];
        const datasets = [
            {
                label: 'Average Util.',
                data: [],
                borderColor: 'rgba(56, 189, 248, 1)', // cyan-400
                backgroundColor: 'rgba(56, 189, 248, 0.1)', // cyan-400 with transparency
                fill: 'start',
                tension: 0.4,
            },
            {
                label: 'Max Util.',
                data: [],
                borderColor: 'rgba(244, 114, 182, 1)', // pink-400
                backgroundColor: 'rgba(244, 114, 182, 0.1)', // pink-400 with transparency
                fill: 'start',
                tension: 0.4,
            }
        ];

        if (isSevenDays) {
            const dailyData = {};
            history.forEach(entry => {
                const entryDate = new Date(entry.timestamp);
                const dateKey = entryDate.toLocaleDateString('en-CA');
                if (!dailyData[dateKey]) {
                    dailyData[dateKey] = { sum: 0, count: 0, max: 0 };
                }
                dailyData[dateKey].sum += entry.averageUtilization;
                dailyData[dateKey].count += 1;
                dailyData[dateKey].max = Math.max(dailyData[dateKey].max, entry.maxUtilization);
            });

            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateKey = date.toLocaleDateString('en-CA');
                labels.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
                const dayData = dailyData[dateKey];
                datasets[0].data.push(dayData ? Math.round(dayData.sum / dayData.count) : null);
                datasets[1].data.push(dayData ? dayData.max : null);
            }
        } else {
            const currentHour = new Date(now);
            currentHour.setMinutes(0, 0, 0);
            const twentyFourHoursAgo = new Date(currentHour.getTime() - 24 * 60 * 60 * 1000);
            const hourlyData = {};

            // Filter history to only include last 24 hours
            const recentHistory = history.filter(entry => new Date(entry.timestamp) >= twentyFourHoursAgo);

            recentHistory.forEach(entry => {
                const entryDate = new Date(entry.timestamp);
                const hourKey = entryDate.getHours();
                if (!hourlyData[hourKey]) {
                    hourlyData[hourKey] = { sum: 0, count: 0, max: 0 };
                }
                hourlyData[hourKey].sum += entry.averageUtilization;
                hourlyData[hourKey].count += 1;
                hourlyData[hourKey].max = Math.max(hourlyData[hourKey].max, entry.maxUtilization);
            });

            for (let i = 23; i >= 0; i--) {
                const date = new Date(currentHour);
                date.setHours(date.getHours() - i);
                if (date >= twentyFourHoursAgo) {
                    labels.push(date.toLocaleTimeString([], { hour: 'numeric', hour12: true }));
                    const hourData = hourlyData[date.getHours()];
                    datasets[0].data.push(hourData ? Math.round(hourData.sum / hourData.count) : null);
                    datasets[1].data.push(hourData ? hourData.max : null);
                }
            }
        }

        return { labels, datasets };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 15,
                    color: 'rgb(160, 160, 160)',
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            filler: {
                propagate: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Utilization (%)',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: 'rgb(160, 160, 160)', // Y-axis title color
                },
                grid: {
                    display: true,
                    color: 'rgba(160, 160, 160, 0.1)', // Grid line color
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 25,
                    font: {
                        size: 12,
                    },
                    color: 'rgb(160, 160, 160)', // Y-axis tick color
                }
            },
            x: {
                title: {
                    display: true,
                    text: isSevenDays ? 'Date' : 'Hour',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: 'rgb(160, 160, 160)', // X-axis title color
                },
                ticks: {
                    maxTicksLimit: isSevenDays ? 7 : 8,
                    autoSkip: true,
                    font: {
                        size: 12,
                    },
                    color: 'rgb(160, 160, 160)', // X-axis tick color
                },
                grid: {
                    display: false,
                    drawBorder: false,
                }
            }
        },
        elements: {
            line: {
                borderWidth: 2,
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 5,
                hoverBackgroundColor: 'white',
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    // 对服务器进行排序，将固定的服务器放在前面
    const sortedServers = [...servers].sort((a, b) => {
        const aIsPinned = pinnedServers.includes(a.name);
        const bIsPinned = pinnedServers.includes(b.name);
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        return 0;
    });

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <HiOutlineChartBar className="w-7 h-7 text-blue-500" />
                    <h2 className={`
                        text-2xl font-bold bg-clip-text text-transparent tracking-tight drop-shadow-sm
                        dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600
                        bg-gradient-to-r from-slate-700 to-slate-900
                    `}>
                        Workload History
                    </h2>
                </div>
                <div className="flex items-center">
                    <ToggleSwitch isSevenDays={isSevenDays} onToggle={setIsSevenDays} />
                </div>
            </div>
            <AnimatePresence>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    layout
                >
                    {sortedServers.map((server) => (
                        <motion.div
                            key={server.ip}
                            layout
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mr-3">
                                        {server.name}
                                    </h3>
                                    <span className="inline-block text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-.5 rounded-full mt-.5">
                                        {server.ip}
                                    </span>
                                    <span className="inline-block text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-.5 rounded-full mt-.5 ml-2">
                                        {server.gpu}
                                    </span>
                                </div>
                                <motion.button
                                    onClick={() => onTogglePin(server.name)}
                                    className={`p-2 rounded-full transition-colors duration-200 ${pinnedServers.includes(server.name)
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <MdPushPin size={18} className={pinnedServers.includes(server.name) ? 'fill-current' : ''} />
                                </motion.button>
                            </div>
                            <div className="h-48">
                                <Line data={getChartData(server.ip)} options={options} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ServerHistoryDashboard;

import React from 'react';

const ProgressBar = ({ value, max, colorClass }) => {
    const percentage = (value / max) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
            <div
                className={`h-full ${colorClass} transition-all duration-500 ease-out relative rounded-full`}
                style={{ width: `${percentage}%` }}
            >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-0 opacity-75 animate-shimmer" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        width: '200%',
                        left: '-50%'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

const GPUCard = ({ gpu }) => {
    const memoryUsagePercentage = (parseFloat(gpu.memUsed) / parseFloat(gpu.memTotal)) * 100;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-300 dark:hover:border-blue-500">
            <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-white">{gpu.name}</h3>
            <div className="flex-grow space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300">
                        <span>Utilization</span>
                        <span className="font-semibold">{gpu.util}%</span>
                    </div>
                    <ProgressBar
                        value={parseFloat(gpu.util)}
                        max={100}
                        colorClass="bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-400"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300">
                        <span>Memory</span>
                        <span className="font-semibold">{memoryUsagePercentage.toFixed(1)}%</span>
                    </div>
                    <ProgressBar
                        value={parseFloat(gpu.memUsed)}
                        max={parseFloat(gpu.memTotal)}
                        colorClass="bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-400"
                    />
                    <div className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                        {gpu.memUsed} / {gpu.memTotal} MiB
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>Temperature</span>
                    <span className="flex font-bold" style={{ color: getTemperatureColor(parseFloat(gpu.temp)) }}>
                        {gpu.temp}°C
                    </span>
                </div>
            </div>
        </div>
    );
};

const getTemperatureColor = (temp) => {
    if (temp < 50) return '#10B981';  // Emerald-500
    if (temp < 70) return '#F59E0B';  // Amber-500
    return '#EF4444';  // Red-500
};

export default GPUCard;

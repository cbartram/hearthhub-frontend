import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const ServerLogs = ({ logs = [] }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current;
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [logs]);

    return (
        <Card className="w-full max-w-4xl bg-black border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-gray-400 text-sm">Server Logs</span>
            </div>
            <CardContent>
                <ScrollArea
                    ref={scrollRef}
                    className="max-h-[765px] overflow-y-scroll no-scrollbar w-full"
                >
                    <div className="p-4 font-mono text-sm leading-relaxed">
                        {logs.map((log, index) => (
                            <div key={index} className="flex hover:bg-gray-900">
                                <span className="text-gray-600 w-12 select-none">
                                    {(index + 1).toString().padStart(4, '0')}
                                </span>
                                <span className="text-green-400">
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ServerLogs;
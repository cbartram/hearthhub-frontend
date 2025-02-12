import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResourceMetrics = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-blue-500">CPU: {payload[0].value}%</p>
                    <p className="text-sm text-green-500">Memory: {payload[1].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Server Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[330px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="time"
                                className="text-sm"
                                tick={{ fill: 'currentColor' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                className="text-sm"
                                tick={{ fill: 'currentColor' }}
                                label={{
                                    value: 'Utilization %',
                                    angle: -90,
                                    position: 'insideLeft',
                                    className: 'fill-current'
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="cpu"
                                name="CPU"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="memory"
                                name="Memory"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResourceMetrics;
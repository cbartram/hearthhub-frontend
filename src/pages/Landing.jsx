import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Shield, Server, Cpu, Cog, Upload, Clock, BarChart, Terminal, Database } from "lucide-react";
import {discordRedirect} from "@/lib/utils";

const Landing = () => {
    const [isHovered, setIsHovered] = useState(null);

    const features = [
        {
            icon: <Server className="w-6 h-6 mb-2 text-orange-500" />,
            title: "Dedicated Server Management",
            description: "Professional management of your Valheim servers with 24/7 uptime and support."
        },
        {
            icon: <Cpu className="w-6 h-6 mb-2 text-orange-500" />,
            title: "Custom Resources",
            description: "Choose your server's CPU and memory specifications to match your needs."
        },
        {
            icon: <Cog className="w-6 h-6 mb-2 text-orange-500" />,
            title: "One-Click Mod Support",
            description: "Upload and enable custom mods with a single click, including Valheim Plus configuration."
        },
        {
            icon: <Upload className="w-6 h-6 mb-2 text-orange-500" />,
            title: "World Upload",
            description: "Continue your adventures by uploading and playing on your existing worlds."
        },
        {
            icon: <Clock className="w-6 h-6 mb-2 text-orange-500" />,
            title: "Automated Backups",
            description: "Configurable automated backups to S3 with one-click restore functionality."
        },
        {
            icon: <BarChart className="w-6 h-6 mb-2 text-orange-500" />,
            title: "Real-Time Metrics",
            description: "Monitor server CPU and memory usage in real-time."
        }
    ];

    const pricingTiers = [
        {
            name: "Warrior",
            price: "$3.99",
            features: [
                "2 CPU Cores",
                "6GB RAM",
                "10GB Storage",
                "Basic Mod Support",
                "Daily Backups"
            ],
            recommended: false
        },
        {
            name: "Jarl",
            price: "$5.99",
            features: [
                "4 CPU Cores",
                "8GB RAM",
                "25GB Storage",
                "Advanced Mod Support",
                "Hourly Backups",
            ],
            recommended: true
        },
        {
            name: "Odin",
            price: "$9.99",
            features: [
                "8 CPU Cores",
                "16GB RAM",
                "50GB Storage",
                "Unlimited Mods",
                "Real-time Backups",
            ],
            recommended: false
        }
    ];

    const testimonials = [
        {
            name: "Erik Thorvaldson",
            role: "Guild Leader",
            content: "Running our 20-player server has never been easier. The mod support is incredible!",
            avatar: "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            name: "Freya Bjornsdottir",
            role: "Community Manager",
            content: "The backup system saved our 60+ hour world when we had issues. Worth every penny!",
            avatar: "https://plus.unsplash.com/premium_photo-1690407617686-d449aa2aad3c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            name: "Thor Ironside",
            role: "Mod Developer",
            content: "As a mod creator, I love how easy it is to test and deploy new mods on these servers.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-bold mb-6">
                        Your Ultimate Valheim Server Solution
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Professional hosting with complete control over your Viking adventure
                    </p>
                    <Button size="lg" className="bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] focus:outline-none focus:bg-[#4c5bfc]" onClick={() => discordRedirect()}>
                        <span className="discord-icon" />
                        Sign In with Discord
                    </Button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-gray-800 border-gray-700 transform transition-all duration-300 hover:scale-105 hover:bg-gray-750"
                            onMouseEnter={() => setIsHovered(index)}
                            onMouseLeave={() => setIsHovered(null)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-center text-xl mt-2">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 text-center">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pricing Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingTiers.map((tier, index) => (
                            <Card
                                key={index}
                                className={`bg-gray-800 border-gray-700 transform transition-all duration-300 hover:scale-105 ${
                                    tier.recommended ? 'border-orange-500 relative' : ''
                                }`}
                            >
                                {tier.recommended && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 px-4 py-1 rounded-full text-sm">
                                        Recommended
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-center text-2xl text-white">{tier.name}</CardTitle>
                                    <p className="text-center text-3xl font-bold text-orange-500 mt-4">{tier.price}</p>
                                    <p className="text-center text-gray-400">per month</p>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-center text-white">
                                                <Shield className="w-4 h-4 text-orange-500 mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-orange-600 hover:bg-orange-700"
                                        variant={tier.recommended ? "default" : "outline"}
                                    >
                                        Select Plan
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Vikings Say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="bg-gray-800 border-gray-700 transform transition-all duration-300 hover:scale-105"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-10 h-10 rounded-full mr-4"
                                        />
                                        <div>
                                            <h4 className="font-bold">{testimonial.name}</h4>
                                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Real-time Monitoring Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Advanced Monitoring & Control
                        </h2>
                        <p className="text-gray-300">
                            Keep track of your server's performance with our comprehensive monitoring tools
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="bg-gray-800 border-gray-700 transform transition-all duration-300 hover:scale-105">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-orange-500" />
                                    Live Server Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-300">
                                    <p>[INFO] Server starting...</p>
                                    <p>[INFO] World loaded successfully</p>
                                    <p>[INFO] Players online: 12/20</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700 transform transition-all duration-300 hover:scale-105">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-orange-500" />
                                    Resource Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span>CPU Usage</span>
                                            <span>65%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{width: '65%'}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span>Memory Usage</span>
                                            <span>4GB/8GB</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{width: '50%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <Card className="bg-gradient-to-r from-red-900 to-orange-400 border-none p-8">
                        <CardContent className="space-y-6">
                            <h2 className="text-3xl font-bold">Ready to Start Your Adventure?</h2>
                            <p className="text-xl">Join thousands of Vikings already hosting their realms with us</p>
                            <Button size="lg" className="bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] focus:outline-none focus:bg-[#4c5bfc]" onClick={() => discordRedirect()}>
                                <span className="discord-icon" />
                                Sign In with Discord
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Landing;
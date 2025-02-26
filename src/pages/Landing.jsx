import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useAnimationControls, useTransform } from 'framer-motion';
import { Server, Cpu, Cog, Upload, Clock, BarChart, Terminal } from "lucide-react";
import {discordRedirect} from "@/lib/utils";

const Landing = () => {
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const pricingRef = useRef(null);
    const testimonialsRef = useRef(null);
    const monitoringRef = useRef(null);
    const [cpuPercentage, setCpuPercentage] = useState(0);
    const [memoryPercentage, setMemoryPercentage] = useState(0);

    // Animation controls for glowing spheres
    const sphere1Controls = useAnimationControls();
    const sphere2Controls = useAnimationControls();
    const sphere3Controls = useAnimationControls();

    // Progress bar target values
    const cpuTargetPercentage = 95;
    const memoryTargetPercentage = 65;

    const memoryTotalGB = 8;
    const memoryUsedGB = (memoryPercentage * memoryTotalGB / 100).toFixed(1);

    const [isOpen, setIsOpen] = useState(false);

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate progress based on scroll position
    useEffect(() => {
        const startScroll = 2100;
        const endScroll = 2650;

        if (scrollY < startScroll) {
            setCpuPercentage(0);
            setMemoryPercentage(0);
        } else if (scrollY > endScroll) {
            setCpuPercentage(cpuTargetPercentage);
            setMemoryPercentage(memoryTargetPercentage);
        } else {
            // During scroll animation range
            const scrollProgress = (scrollY - startScroll) / (endScroll - startScroll);
            setCpuPercentage(Math.round(scrollProgress * cpuTargetPercentage));
            setMemoryPercentage(Math.round(scrollProgress * memoryTargetPercentage - 35));
        }
    }, [scrollY, cpuTargetPercentage, memoryTargetPercentage]);


    useEffect(() => {
        const animateSpheres = async () => {
            // Create random floating animation for each sphere
            sphere1Controls.start({
                x: [0, 20, -10, 5, 0],
                y: [0, -30, -10, -20, 0],
                scale: [1, 1.1, 0.95, 1.05, 1],
                opacity: [0.5, 0.7, 0.6, 0.8, 0.5],
                transition: {
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            });

            sphere2Controls.start({
                x: [0, -30, -10, -20, 0],
                y: [0, 10, 30, 15, 0],
                scale: [1, 1.2, 0.9, 1.1, 1],
                opacity: [0.6, 0.4, 0.7, 0.5, 0.6],
                transition: {
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            });

            sphere3Controls.start({
                x: [0, 15, 25, 10, 0],
                y: [0, 20, -15, 5, 0],
                scale: [1, 0.9, 1.15, 0.95, 1],
                opacity: [0.4, 0.6, 0.3, 0.5, 0.4],
                transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            });
        };

        animateSpheres();
    }, [sphere1Controls, sphere2Controls, sphere3Controls]);

    const features = [
        {
            icon: <Server className="w-6 h-6 mb-2" />,
            title: "Dedicated Server Management",
            description: "Professional management of your Valheim servers with 24/7 uptime and support."
        },
        {
            icon: <Cpu className="w-6 h-6 mb-2" />,
            title: "Custom Resources",
            description: "Choose your server's CPU and memory specifications to match your needs."
        },
        {
            icon: <Cog className="w-6 h-6 mb-2" />,
            title: "One-Click Mod Support",
            description: "Upload and enable custom mods with a single click, including Valheim Plus configuration."
        },
        {
            icon: <Upload className="w-6 h-6 mb-2" />,
            title: "World Upload",
            description: "Continue your adventures by uploading and playing on your existing worlds."
        },
        {
            icon: <Clock className="w-6 h-6 mb-2" />,
            title: "Automated Backups",
            description: "Configurable automated backups to S3 with one-click restore functionality."
        },
        {
            icon: <BarChart className="w-6 h-6 mb-2" />,
            title: "Real-Time Metrics",
            description: "Monitor server CPU and memory usage in real-time."
        }
    ];

    const pricingTiers = [
        {
            name: "Starter",
            price: "$4.99",
            features: [
                "4GB RAM",
                "2 CPU Cores",
                "3 Backups",
                "2 Worlds",
                "24/7 Uptime",
                "Basic Support"
            ],
            recommended: false
        },
        {
            name: "Warrior",
            price: "$7.99",
            features: [
                "8GB RAM",
                "3 CPU Cores",
                "6 Backups per world",
                "4 Worlds",
                "24/7 Uptime",
                "Basic Support",
            ],
            recommended: true
        },
        {
            name: "Legend",
            price: "$9.99",
            features: [
                "16GB RAM",
                "8 CPU Cores",
                "8 Backups per world",
                "6 Worlds",
                "24/7 Uptime",
                "Basic Support",
                "Existing World Upload"
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

    // Function to calculate opacity based on scroll position
    const calculateOpacity = (elementRef, startFade = 0.8, endFade = 0.2) => {
        if (!elementRef.current) return 1;

        const rect = elementRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // When element is fully visible
        if (elementTop > 0 && elementTop < windowHeight - elementHeight) return 1;

        // When element is partially visible at top
        if (elementTop < 0 && elementTop > -elementHeight) {
            return Math.max((elementHeight + elementTop) / elementHeight * endFade, 0);
        }

        // When element is partially visible at bottom
        if (elementTop > windowHeight - elementHeight && elementTop < windowHeight) {
            return Math.max((windowHeight - elementTop) / elementHeight * startFade, 0);
        }

        return 0;
    };

    return (
        <div className="bg-black text-white overflow-hidden">
            <motion.nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800" style={{
                backgroundColor: "rgba(17, 24, 39, 0.7)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
            }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <motion.div
                                className="flex-shrink-0 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="#" className="flex items-center">
                                    {/* Viking axe icon */}
                                    <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 15L20 9L22 11L16 17L14 15Z" />
                                        <path d="M8.5 9L10.5 7L18 14.5L16 16.5L8.5 9Z" />
                                        <path d="M8.5 9L7 10.5L3 6.5L4.5 5L8.5 9Z" />
                                        <path d="M7 10.5L2 15.5L3.5 17L8.5 12L7 10.5Z" />
                                        <path d="M14 15L12 17L4.5 9.5L6.5 7.5L14 15Z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-white">Valheim Server</span>
                                </a>
                            </motion.div>

                            {/* Desktop navigation links */}
                            <div className="hidden md:ml-8 md:flex md:space-x-6">
                                <motion.a
                                    href="#features"
                                    className="text-gray-300 hover:text-white py-2 text-sm font-medium"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    Features
                                </motion.a>
                                <motion.a
                                    href="#pricing"
                                    className="text-gray-300 hover:text-white py-2 text-sm font-medium"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    Pricing
                                </motion.a>
                                <motion.a
                                    href="#mods"
                                    className="text-gray-300 hover:text-white py-2 text-sm font-medium"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    Mods
                                </motion.a>
                                <motion.a
                                    href="#community"
                                    className="text-gray-300 hover:text-white py-2 text-sm font-medium"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    Community
                                </motion.a>
                            </div>
                        </div>

                        {/* Right side with CTA and mobile menu button */}
                        <div className="flex items-center">
                            <motion.div className="hidden md:flex">
                                <motion.button
                                    href="#join"
                                    className="ml-4 px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] focus:outline-none focus:bg-[#4c5bfc] text-white text-sm font-medium"
                                    whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                    onClick={() => discordRedirect()}
                                >
                                    <span className="discord-icon mr-2" />
                                    Sign in with Discord
                                </motion.button>
                            </motion.div>

                            {/* Mobile menu button */}
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state. */}
                <motion.div
                    className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Features</a>
                        <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Pricing</a>
                        <a href="#mods" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Mods</a>
                        <a href="#community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Community</a>
                        <a href="#status" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Server Status</a>
                        <motion.button
                            href="#join"
                            className="ml-4 px-4 py-2 rounded-md bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] focus:outline-none focus:bg-[#4c5bfc] text-white text-sm font-medium"
                            whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                            onClick={() => discordRedirect()}
                        >
                            <span className="discord-icon mr-2" />
                            Sign in with Discord
                        </motion.button>
                    </div>
                </motion.div>
            </motion.nav>

            <div className="relative overflow-hidden bg-black min-h-screen flex items-center" ref={heroRef}>
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at ${50 + (scrollY * 0.02)}% ${30 + (scrollY * 0.01)}%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%),
                         radial-gradient(circle at ${20 - (scrollY * 0.01)}% ${70 - (scrollY * 0.02)}%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%)`,
                    }}
                />

                <motion.div
                    className="absolute top-0 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 blur-3xl"
                    animate={sphere1Controls}
                    initial={{ opacity: 0.5 }}
                />

                <motion.div
                    className="absolute bottom-40 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 blur-3xl"
                    animate={sphere2Controls}
                    initial={{ opacity: 0.6 }}
                />

                <motion.div
                    className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 blur-3xl"
                    animate={sphere3Controls}
                    initial={{ opacity: 0.4 }}
                />

                <div className="container relative mx-auto px-4 pt-24 pb-20">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            style={{ y: scrollY * -0.2 }}
                        >
                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: `linear-gradient(90deg, 
                    hsl(${210 + scrollY * 0.20}, 100%, 70%) 0%, 
                    hsl(${360 + scrollY * 0.20}, 100%, 70%) 100%)`
                                }}
                            >
                                Your Ultimate Valheim Server Solution
                            </motion.h1>

                            <motion.p
                                className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                                style={{ opacity: 1 - scrollY * 0.002 }}
                            >
                                Professional hosting with complete control over your Viking adventure
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                style={{ y: scrollY * 0.1 }}
                            >
                                <motion.button
                                    onClick={() => discordRedirect()}
                                    className="bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] text-white focus:outline-none focus:bg-[#4c5bfc] font-medium px-8 py-6 h-auto rounded-full"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="discord-icon mr-2" />
                                    Sign in with Discord
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-800"
                            style={{
                                opacity: 1 - scrollY * 0.003,
                                y: scrollY * 0.1
                            }}
                        >
                            <motion.div
                                className="text-center"
                                whileHover={{ y: -5 }}
                            >
                                <motion.p
                                    className="text-3xl font-bold mb-1"
                                    style={{
                                        color: `hsl(${210 + scrollY * 0.1}, 100%, 70%)`
                                    }}
                                >
                                    99.9%
                                </motion.p>
                                <p className="text-sm text-gray-400">Uptime guarantee</p>
                            </motion.div>

                            <motion.div
                                className="text-center"
                                whileHover={{ y: -5 }}
                            >
                                <motion.p
                                    className="text-3xl font-bold mb-1"
                                    style={{
                                        color: `hsl(${240 + scrollY * 0.1}, 100%, 70%)`
                                    }}
                                >
                                    50+
                                </motion.p>
                                <p className="text-sm text-gray-400">Active servers</p>
                            </motion.div>

                            <motion.div
                                className="text-center"
                                whileHover={{ y: -5 }}
                            >
                                <motion.p
                                    className="text-3xl font-bold mb-1"
                                    style={{
                                        color: `hsl(${270 + scrollY * 0.1}, 100%, 70%)`
                                    }}
                                >
                                    24/7
                                </motion.p>
                                <p className="text-sm text-gray-400">Expert support</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-blue-500 opacity-70"
                        animate={{
                            x: [
                                Math.random() * window.innerWidth,
                                Math.random() * window.innerWidth,
                            ],
                            y: [
                                Math.random() * window.innerHeight,
                                Math.random() * window.innerHeight,
                            ],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            left: Math.random() * window.innerWidth,
                            top: Math.random() * window.innerHeight,
                            filter: "blur(1px)",
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 pb-24" id="features">
                <div className="mb-32" ref={featuresRef}>
                    <motion.div
                        className="text-center mb-16"
                        style={{
                            opacity: calculateOpacity(featuresRef),
                            y: scrollY * 0.05
                        }}
                    >
                        <motion.h2
                            className="text-3xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, 
                  hsl(${210 + scrollY * 0.05}, 100%, 70%) 0%, 
                  hsl(${260 + scrollY * 0.05}, 100%, 70%) 100%)`
                            }}
                        >
                            Everything you need for your Valheim server
                        </motion.h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Powerful tools designed to give you complete control over your Viking experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 relative overflow-hidden"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    borderColor: `hsl(${210 + index * 30}, 100%, 50%)`,
                                    boxShadow: `0 0 20px rgba(${59 + index * 20}, ${130 - index * 20}, 246, 0.3)`
                                }}
                            >
                                {/* Animated gradient background */}
                                <motion.div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        background: `radial-gradient(circle at 50% 50%, 
                      hsl(${210 + index * 30 + scrollY * 0.05}, 100%, 50%) 0%, 
                      transparent 70%)`
                                    }}
                                />

                                <motion.div
                                    className="mb-4"
                                    style={{
                                        color: `hsl(${210 + index * 30 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                >
                                    {feature.icon}
                                </motion.div>

                                <motion.h3
                                    className="text-xl font-medium mb-3 text-white relative z-10"
                                    style={{
                                        textShadow: `0 0 8px rgba(${59 + index * 20}, ${130 - index * 20}, 246, ${scrollY * 0.0005})`
                                    }}
                                >
                                    {feature.title}
                                </motion.h3>

                                <p className="text-gray-400 relative z-10">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mb-12" ref={pricingRef} id="pricing">
                    <motion.div
                        className="text-center mb-16"
                        style={{
                            opacity: calculateOpacity(pricingRef),
                            y: scrollY * 0.05
                        }}
                    >
                        <motion.h2
                            className="text-3xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, 
                  hsl(${210 + scrollY * 0.05}, 100%, 70%) 0%, 
                  hsl(${260 + scrollY * 0.05}, 100%, 70%) 100%)`
                            }}
                        >
                            Simple, transparent pricing
                        </motion.h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Choose the plan that's right for your Viking adventure
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={index}
                                className={`bg-gray-900/50 backdrop-blur rounded-xl border relative overflow-hidden ${
                                    tier.recommended
                                        ? 'border-blue-500/50'
                                        : 'border-gray-800'
                                }`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: tier.recommended
                                        ? `0 0 30px rgba(59, 130, 246, 0.3)`
                                        : `0 0 20px rgba(255, 255, 255, 0.1)`
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        background: tier.recommended
                                            ? `radial-gradient(circle at 50% 50%, 
                          hsl(${230 + scrollY * 0.05}, 100%, 50%) 0%, 
                          transparent 70%)`
                                            : ''
                                    }}
                                />

                                {tier.recommended && (
                                    <motion.div
                                        className="absolute mt-2 -top-0 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium z-10"
                                        style={{
                                            background: `linear-gradient(90deg, 
                        hsl(${100 + scrollY * 0.1}, 100%, 50%) 0%, 
                        hsl(${160 + scrollY * 0.1}, 100%, 50%) 100%)`,
                                            boxShadow: `0 0 15px rgba(124, 58, 237, ${0.3 + scrollY * 0.001})`
                                        }}
                                    >
                                        Most popular
                                    </motion.div>
                                )}

                                <div className="p-6 relative z-10">
                                    <h3 className="text-xl font-medium mb-2 text-white">{tier.name}</h3>

                                    <div className="flex items-baseline mb-5">
                                        <motion.span
                                            className="text-3xl font-semibold"
                                            style={{
                                                color: tier.recommended
                                                    ? `hsl(${230 + scrollY * 0.1}, 100%, 70%)`
                                                    : 'white'
                                            }}
                                        >
                                            {tier.price}
                                        </motion.span>
                                        <span className="text-gray-400 ml-2">/ month</span>
                                    </div>

                                    <div className="border-t border-gray-800 my-6"></div>

                                    <ul className="space-y-3 mb-8">
                                        {tier.features.map((feature, fIndex) => (
                                            <motion.li
                                                key={fIndex}
                                                className="flex items-start"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 + fIndex * 0.05 }}
                                            >
                                                <motion.div
                                                    className="mr-3 mt-1"
                                                    style={{
                                                        color: tier.recommended
                                                            ? `hsl(${230 + fIndex * 10 + scrollY * 0.05}, 100%, 70%)`
                                                            : `hsl(${210 + fIndex * 10 + scrollY * 0.05}, 100%, 70%)`
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M5.6 9.6L3.2 7.2L2 8.4L5.6 12L14 3.6L12.8 2.4L5.6 9.6Z" fill="currentColor"/>
                                                    </svg>
                                                </motion.div>
                                                <span className="text-gray-300">{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <motion.button
                                        className={`w-full py-5 rounded-full font-medium ${
                                            tier.recommended
                                                ? 'text-white'
                                                : 'bg-white text-black hover:bg-gray-100'
                                        }`}
                                        style={tier.recommended ? {
                                            background: `linear-gradient(90deg, 
                        hsl(${100 + scrollY * 0.1}, 100%, 50%) 0%, 
                        hsl(${160 + scrollY * 0.1}, 100%, 50%) 100%)`
                                        } : {}}
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: tier.recommended
                                                ? `0 0 20px rgba(124, 58, 237, 0.4)`
                                                : `0 0 20px rgba(255, 255, 255, 0.2)`
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => discordRedirect()}
                                    >
                                        Select plan
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mb-12" ref={testimonialsRef}>
                    <motion.div
                        className="text-center mb-16"
                        style={{
                            opacity: calculateOpacity(testimonialsRef),
                            y: scrollY * 0.05
                        }}
                    >
                        <motion.h2
                            className="text-3xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, 
                  hsl(${210 + scrollY * 0.05}, 100%, 70%) 0%, 
                  hsl(${260 + scrollY * 0.05}, 100%, 70%) 100%)`
                            }}
                        >
                            Trusted by Vikings worldwide
                        </motion.h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            See what our community has to say about our service
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mt-48">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 relative overflow-hidden"
                                initial={{ opacity: 0, y: 30, rotateY: 30 }}
                                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    y: -5,
                                    borderColor: `hsl(${210 + index * 20 + scrollY * 0.05}, 100%, 70%)`,
                                    boxShadow: `0 0 20px rgba(${59 + index * 20}, ${130 - index * 20}, 246, 0.2)`
                                }}
                            >
                                {/* Animated quote marks */}
                                <motion.div
                                    className="absolute right-4 top-4 text-5xl opacity-10 font-serif"
                                    animate={{
                                        y: [0, 5, 0],
                                        opacity: [0.05, 0.1, 0.05]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3 + index,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        color: `hsl(${210 + index * 20 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                >
                                    "
                                </motion.div>

                                <div className="flex items-start mb-4 relative z-10">
                                    <motion.img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full mr-4"
                                        whileHover={{ scale: 1.1 }}
                                    />
                                    <div>
                                        <motion.h4
                                            className="font-medium text-white"
                                            style={{
                                                textShadow: `0 0 8px rgba(${59 + index * 20}, ${130 - index * 20}, 246, ${scrollY * 0.0005})`
                                            }}
                                        >
                                            {testimonial.name}
                                        </motion.h4>
                                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 relative z-10">"{testimonial.content}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mb-32" ref={monitoringRef}>
                    <motion.div
                        className="text-center mb-16"
                        style={{
                            opacity: calculateOpacity(monitoringRef),
                            y: scrollY * 0.05
                        }}
                    >
                        <motion.h2
                            className="text-3xl font-semibold tracking-tight mb-4 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, 
                  hsl(${210 + scrollY * 0.05}, 100%, 70%) 0%, 
                  hsl(${260 + scrollY * 0.05}, 100%, 70%) 100%)`
                            }}
                        >
                            Advanced monitoring & control
                        </motion.h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Real-time insights and full control over your server's performance
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-48 relative">
                        <motion.div
                            className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 blur-3xl"
                            animate={sphere1Controls}
                            initial={{ opacity: 0.5 }}
                        />

                        <motion.div
                            className="absolute bottom-60 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 blur-3xl"
                            animate={sphere2Controls}
                            initial={{ opacity: 0.6 }}
                        />

                        <motion.div
                            className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 blur-3xl"
                            animate={sphere3Controls}
                            initial={{ opacity: 0.4 }}
                        />



                        <motion.div
                            className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 relative overflow-hidden"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{
                                borderColor: `hsl(${210 + scrollY * 0.05}, 100%, 70%)`,
                                boxShadow: `0 0 20px rgba(59, 130, 246, 0.2)`
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 opacity-5"
                                style={{
                                    background: `radial-gradient(circle at ${50 + (scrollY * 0.01)}% ${50 + Math.sin(scrollY * 0.005) * 10}%, 
                    rgba(59, 130, 246, 1) 0%, transparent 70%)`
                                }}
                            />

                            <div className="flex items-center mb-4 relative z-10">
                                <motion.div
                                    className="mr-2"
                                    animate={{
                                        rotate: [0, 5, 0, -5, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 5,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        color: `hsl(${210 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                >
                                    <Terminal className="w-5 h-5" />
                                </motion.div>
                                <h3 className="text-xl font-medium text-white">Live Server Logs</h3>
                            </div>

                            <motion.div
                                className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-gray-400 overflow-hidden relative"
                                whileHover={{ y: -5 }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 h-full w-1"
                                    style={{
                                        background: `linear-gradient(to bottom, 
                      transparent, 
                      hsl(${210 + scrollY * 0.05}, 100%, 70%), 
                      transparent)`,
                                        y: scrollY % 200
                                    }}
                                />

                                <motion.p
                                    className="border-l-2 pl-2 mb-2"
                                    style={{
                                        borderColor: `hsl(${210 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                    animate={{
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut"
                                    }}
                                >
                                    [INFO] Server starting...
                                </motion.p>

                                <motion.p
                                    className="border-l-2 pl-2 mb-2"
                                    style={{
                                        borderColor: `hsl(${260 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                    animate={{
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        delay: 0.5,
                                        ease: "easeInOut"
                                    }}
                                >
                                    [INFO] World loaded successfully
                                </motion.p>

                                <motion.p
                                    className="border-l-2 pl-2"
                                    style={{
                                        borderColor: `hsl(${130 + scrollY * 0.05}, 100%, 70%)`
                                    }}
                                    animate={{
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        delay: 1,
                                        ease: "easeInOut"
                                    }}
                                >
                                    [INFO] Players online: 12/20
                                </motion.p>
                            </motion.div>
                        </motion.div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="text-gray-300">CPU Usage</span>
                                    <motion.span
                                        className="text-blue-400 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {cpuPercentage}%
                                    </motion.span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full"
                                        style={{ width: cpuPercentage + '%' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="text-gray-300">Memory Usage</span>
                                    <motion.span
                                        className="text-blue-400 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {memoryUsedGB}GB/{memoryTotalGB}GB
                                    </motion.span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full"
                                        style={{ width: memoryPercentage + '%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 mb-20">
                    <motion.div
                        className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900/30 to-violet-900/30 backdrop-blur border border-blue-900/50 rounded-2xl p-12 text-center relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.1 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10"
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <div className="relative">
                            <motion.h2
                                className="text-3xl md:text-4xl font-semibold mb-6"
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Ready to start your adventure?
                            </motion.h2>

                            <motion.p
                                className="text-xl text-gray-300 mb-8"
                                initial={{ opacity: 0, y: -5 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                Join thousands of Vikings already hosting their realms with us
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => discordRedirect()}
                                    className="bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] text-white focus:outline-none focus:bg-[#4c5bfc] font-medium px-8 py-6 h-auto rounded-full"
                                >
                                    <span className="discord-icon mr-2" />
                                    Sign in with Discord
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
        </div>
            <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                        <motion.div
                            className="col-span-2 md:col-span-1"
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Valheim Server</h3>
                            <p className="text-sm mb-4">Join the battle in Valheim with our dedicated server hosting. Experience lag-free gameplay and conquer the Norse wilderness.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Discord</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Server</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Mods</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Server Status</a></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Community</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Discord</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Events</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Rules</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Showcase</a></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Join Our Server</h3>
                            <p className="text-base text-gray-400 mb-4">Get updates on server events and maintenance.</p>
                            <form className="mt-4 sm:flex sm:max-w-md">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    autoComplete="email"
                                    required
                                    className="appearance-none min-w-0 w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400"
                                    placeholder="Enter your email"
                                />
                                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                                    >
                                        Subscribe
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        transition={{ delay: 0.5 }}
                        className="mt-12 pt-8 border-t border-gray-800"
                    >
                        <p className="text-base text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} Valheim Dedicated Server. All rights reserved.
                        </p>
                        <div className="mt-4 flex justify-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Sitemap</a>
                        </div>
                    </motion.div>
                </div>
            </footer>
    </div>
    );
};

export default Landing;
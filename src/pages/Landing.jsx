import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useAnimationControls } from 'framer-motion';
import { Shield, Server, Cpu, Cog, Upload, Clock, BarChart, Terminal, Database } from "lucide-react";
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
            icon: <Terminal size={24} />,
            title: "One-Click Installation",
            description: "Get your server running in seconds with our streamlined setup process"
        },
        {
            icon: <Shield size={24} />,
            title: "Automatic Backups",
            description: "Your world is always safe with scheduled backups and easy restoration"
        },
        {
            icon: <Database size={24} />,
            title: "Mod Support",
            description: "Install and manage your favorite mods with our intuitive control panel"
        },
    ];

    const pricingTiers = [
        {
            name: "Starter",
            price: "$3.99",
            features: [
                "2GB RAM",
                "10 Player Slots",
                "24/7 Uptime",
                "Basic Support"
            ],
            recommended: false
        },
        {
            name: "Warrior",
            price: "$5.99",
            features: [
                "4GB RAM",
                "20 Player Slots",
                "24/7 Uptime",
                "Priority Support",
                "Unlimited Backups"
            ],
            recommended: true
        },
        {
            name: "Legend",
            price: "$9.99",
            features: [
                "8GB RAM",
                "40 Player Slots",
                "24/7 Uptime",
                "Premium Support",
                "Unlimited Backups",
                "Custom Domain"
            ],
            recommended: false
        }
    ];

    // Example testimonials
    const testimonials = [
        {
            avatar: "/api/placeholder/40/40",
            name: "Erik Thorvaldson",
            role: "Guild Leader",
            content: "Our clan has been using this service for months. The performance is incredible and support is always responsive."
        },
        {
            avatar: "/api/placeholder/40/40",
            name: "Freya Jorgensen",
            role: "Experienced Player",
            content: "I was tired of lag on my self-hosted server. Switching to this service solved all my problems instantly."
        },
        {
            avatar: "/api/placeholder/40/40",
            name: "Bjorn Ironside",
            role: "Streamer",
            content: "As a content creator, server reliability is crucial. This service has never let me or my viewers down."
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
            {/* Interactive Hero Section */}
            <div className="relative overflow-hidden bg-black min-h-screen flex items-center" ref={heroRef}>
                {/* Animated background gradient */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at ${50 + (scrollY * 0.02)}% ${30 + (scrollY * 0.01)}%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%),
                         radial-gradient(circle at ${20 - (scrollY * 0.01)}% ${70 - (scrollY * 0.02)}%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%)`,
                    }}
                />

                {/* Animated background glowing spheres */}
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
                        {/* Main content with parallax effect */}
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
                                    className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-6 rounded-full"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get started
                                </motion.button>

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

                        {/* Interactive Stats section */}
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

                {/* Floating particles */}
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

            <div className="container mx-auto px-4 pb-24">
                {/* Features Section with scroll interactions */}
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

                {/* Pricing Section with interactive elements */}
                <div className="mb-12" ref={pricingRef}>
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
                                {/* Animated gradient background */}
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
                                    >
                                        Select plan
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Testimonials with scroll effects */}
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

                {/* Monitoring Section with interactive elements */}
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
                        {/* Animated background glowing spheres */}
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
                            {/* Animated background effect */}
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
    </div>
    );
};

export default Landing;
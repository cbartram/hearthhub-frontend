import React, {useEffect, useState} from 'react';
import {Check, TriangleAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {KubeApiClient} from "@/lib/api.js";
import {useAuth} from "@/context/AuthContext.jsx";
import Navbar from "@/components/Navbar.jsx";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const Pricing = () => {
    const {user, logout} = useAuth()
    const apiClient = new KubeApiClient(user)
    let [canceled, setCanceled] = useState(false);

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

    const createStripeCheckoutSession = async (item) => {
        try {
            const res = await apiClient.createCheckoutSession(item)
            window.location.href = res.url
        } catch (e) {
            console.log('error creating stripe checkout session: ', e)
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if(query.get("canceled")) {
            setCanceled(true)
        }
    }, [])

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <Navbar
                onLogout={logout}
                userId={user.discordId}
                avatarId={user.avatarId}
            />
            {
                canceled &&
                <div className="flex align-center justify-center">
                    <Alert className="border-2 border-orange-300  mt-12 max-w-3xl">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Order Canceled</AlertTitle>
                        <AlertDescription>
                            Your order has been cancelled and you have <b>not</b> been charged.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Valheim Dedicated Servers
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500">
                        Choose the perfect server for your Viking adventure
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {pricingTiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`flex flex-col border-2 ${
                                tier.recommended
                                    ? 'border-blue-500 shadow-lg shadow-blue-100'
                                    : 'border-gray-200'
                            } rounded-xl`}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-center mb-2">
                                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                                    {tier.recommended && (
                                        <Badge className="bg-blue-500 hover:bg-blue-600">
                                            Recommended
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-gray-500">
                                    Monthly subscription
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    <span className="text-gray-500 ml-2">/month</span>
                                </div>
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full py-6 ${
                                        tier.recommended
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-900 hover:bg-gray-800'
                                    }`}
                                    onClick={() => createStripeCheckoutSession(tier)}
                                >
                                    Get started
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Additional Information */}
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">All plans include</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4">
                            <h3 className="font-medium">Instant Setup</h3>
                            <p className="text-gray-500 text-sm">Deploy in seconds</p>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">DDoS Protection</h3>
                            <p className="text-gray-500 text-sm">Built-in security</p>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">Easy Modding</h3>
                            <p className="text-gray-500 text-sm">One-click installs</p>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">Global Locations</h3>
                            <p className="text-gray-500 text-sm">Low latency worldwide</p>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">Automated Updates</h3>
                            <p className="text-gray-500 text-sm">Always up to date</p>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">Friendly Support</h3>
                            <p className="text-gray-500 text-sm">Help when you need it</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
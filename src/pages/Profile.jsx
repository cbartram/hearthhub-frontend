import React, {useEffect, useState} from 'react';
import {CalendarDays, CreditCard, CheckCircle, AlertCircle, ExternalLink, CalendarSync} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {useAuth} from "@/context/AuthContext.jsx";
import {KubeApiClient} from "@/lib/api.js";
import Navbar from "@/components/Navbar.jsx";
import {Skeleton} from "@/components/ui/skeleton";
import SkeletonLoading from "@/components/SkeletonLoading.jsx";

const Profile = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user);
    const [subscriptionDetails, setSubscriptionDetails] = useState({})
    const [loading, setLoading] = useState(false)

    const subscription = {
        status: 'active', // active, canceled, past_due, incomplete, etc.
        planName: 'Pro Plan',
        currentPeriodStart: '2025-02-01T00:00:00Z',
        currentPeriodEnd: '2025-03-31T23:59:59Z',
        nextBillingDate: '2025-03-31T23:59:59Z',
        cancelAtPeriodEnd: false,
    };

    const calculateDaysUntilDue = (periodEnd) => {
        const now = new Date();
        const dueDate = new Date(periodEnd);
        const diffTime = dueDate - now;
        console.log(diffTime)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString * 1000)
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    useEffect(() => {
        setLoading(true)

        const fetchSubDetails = async () => {
            if(user.subscriptionId) {
                try {
                   const res = await kubeApi.getSubscriptionDetails(user.subscriptionId)
                    setSubscriptionDetails(res)
                } catch (e) {
                    console.error('failed to get sub details: ', e)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchSubDetails()
    }, []);

    const getStatusBadge = () => {
        switch (subscription.status) {
            case 'active':
                return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>;
            case 'canceled':
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Canceled</Badge>;
            case 'past_due':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Past Due</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{subscription.status}</Badge>;
        }
    };

    const getDaysUntilDue =(periodEnd) => {
        const now = new Date();
        const dueDate = new Date(periodEnd * 1000);
        const diffTime = dueDate - now;
        console.log(diffTime)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    /**
     * Creates a new billing session to direct users towards using the customer id.
     * @param customerId String stripe customer id
     * @returns {Promise<void>}
     */
    const createBillingSession = async (customerId) => {
        try {
            const res = await kubeApi.createBillingSession(null, customerId)
            window.location.href = res.url
        } catch (e) {
            console.log('error creating stripe billing session: ', e)
        }
    }

    if(loading) {
        return <SkeletonLoading />
    }

    return (
        <>
            <Navbar
                onLogout={logout}
                onBillingSession={() => createBillingSession(user.customerId)}
                userId={user.discordId}
                avatarId={user.avatarId}
            />
            <div className="bg-gray-50 min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Account</h1>
                        <p className="text-gray-600">Manage your account details and subscription</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-xl">Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center space-y-4">
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatarId}?size=56`}
                                        alt="Avatar"
                                        className="rounded-full w-20 h-20 border border-gray-200"
                                    />
                                    <div className="text-center">
                                        <h3 className="font-medium text-gray-900">{user.discordUsername}</h3>
                                        <p className="text-sm text-gray-500">Discord ID: {user.discordId}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {
                            user.subscriptionId ?
                        <Card className="md:col-span-2">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl">Subscription</CardTitle>
                                    <CardDescription>Current plan and billing information</CardDescription>
                                </div>
                                {getStatusBadge()}
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{subscriptionDetails.items.data[0].price.lookup_key}</h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            <span>Next billing date: {subscriptionDetails.status === "active" && subscriptionDetails.canceled_at === 0 ? formatDate(subscriptionDetails.current_period_end): 'None'}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">Period Start</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarDays className="h-4 w-4 mr-2" />
                                                <span>{formatDate(subscriptionDetails.current_period_start)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">Period End</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarDays className="h-4 w-4 mr-2" />
                                                <span>{formatDate(subscriptionDetails.current_period_end)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">Automatic Renewal</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <CalendarSync className="h-4 w-4 mr-2" />
                                                <span>
                                                    {
                                                        subscriptionDetails.canceled_at === 0 ?
                                                       <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Renews</Badge> :
                                                       <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Canceled</Badge>
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${subscriptionDetails.status === 'active' && subscriptionDetails.canceled_at === 0 ? 'bg-blue-50' : 'bg-orange-50'} p-4 rounded-lg flex items-start`}>
                                        {subscription.status === 'active' && subscriptionDetails.canceled_at === 0 ? (
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {subscription.status === 'active' && subscriptionDetails.canceled_at === 0
                                                    ? `Your subscription is active`
                                                    : `Attention needed with your subscription`}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {subscription.status === 'active' && subscriptionDetails.canceled_at === 0
                                                    ? `${getDaysUntilDue(subscriptionDetails.current_period_end)} days until your next payment is due.`
                                                    : `Your subscription has been cancelled and access will be revoked in ${getDaysUntilDue(subscriptionDetails.current_period_end)} days.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-lg">
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => createBillingSession(user.customerId)}>
                                    <span>Manage Subscription</span>
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card> :
                        <Card className="md:col-span-2">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl">Subscription</CardTitle>
                                    <CardDescription>Current plan and billing information</CardDescription>
                                </div>
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No Subscription</Badge>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-6">
                                    <p className="text-lg">You are not currently subscribed to a plan.</p>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 focus:border-0 active:border-0 focus:outline-none active:outline-none" onClick={() => window.location.href = "/pricing"}>Purchase Plan</Button>
                                </div>
                            </CardContent>
                        </Card>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
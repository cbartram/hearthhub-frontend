import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {useAuth} from "@/context/AuthContext.jsx";
import Navbar from "@/components/Navbar.jsx";
import {KubeApiClient} from "@/lib/api";

const SupportEmailForm = () => {
    const {user, logout} = useAuth()
    const kubeApi = new KubeApiClient(user)
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            setError('Please fill out both subject and message fields');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            const res = await kubeApi.sendEmail(subject, message);
            console.log(res)
            setStatus('success');

            setTimeout(() => {
                setSubject('');
                setMessage('');
                setStatus('idle');
            }, 3000);

        } catch (err) {
            setStatus('error');
            setError('Failed to send your message. Please try again.');
        }
    };

    return (
        <>
            <Navbar
                onLogout={logout}
                onBillingSession={() => createBillingSession(user.customerId)}
                userId={user.discordId}
                avatarId={user.avatarId}
            />
            <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="bg-white border-b border-gray-100">
                    <CardTitle className="text-xl font-semibold text-gray-900">Contact Support</CardTitle>
                    <CardDescription className="text-gray-500">
                        Our support team typically responds within 24 hours.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Brief description of your issue"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                disabled={status === 'loading' || status === 'success'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Please provide details about your issue..."
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                                disabled={status === 'loading' || status === 'success'}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <CheckCircle2 size={16} />
                                <span>Message sent successfully. We'll get back to you soon.</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <Button
                            type="submit"
                            className={`h-10 px-4 rounded-md font-medium mt-4 ${
                                status === 'loading' || status === 'success'
                                    ? 'bg-indigo-400 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                            disabled={status === 'loading' || status === 'success'}
                        >
                            {status === 'loading' ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sending...</span>
                                </div>
                            ) : status === 'success' ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Sent</span>
                                </div>
                            ) : (
                                'Send message'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </>
    );
};

export default SupportEmailForm;
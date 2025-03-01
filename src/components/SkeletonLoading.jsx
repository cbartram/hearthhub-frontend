import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const SkeletonLoading = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar Skeleton */}
            <div className="w-64 h-full border-r bg-background p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-32" />
                </div>

                <div className="space-y-6">
                    {/* Navigation Items */}
                    {Array(5).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-md" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>

                <div className="mt-auto space-y-4">
                    {/* Bottom sidebar items */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-24 flex flex-col">
                {/* Navbar Skeleton */}
                <div className="h-16 border-b flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 p-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Header Area */}
                        <div className="mb-8">
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-full max-w-md" />
                        </div>

                        {/* Main Content Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="border rounded-lg p-6 space-y-4">
                                <Skeleton className="h-6 w-36 mb-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="pt-4">
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                            </div>

                            <div className="border rounded-lg p-6 space-y-4">
                                <Skeleton className="h-6 w-40 mb-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-3/4" />
                                <div className="pt-4">
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Content */}
                        <div className="border rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>

                            <div className="space-y-4">
                                {Array(3).fill(0).map((_, index) => (
                                    <div key={index} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                            <div>
                                                <Skeleton className="h-4 w-32 mb-2" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Processing State */}
                        <div className="hidden">
                            <div className="flex flex-col items-center justify-center py-12">
                                <Skeleton className="h-6 w-72 mb-6" />
                                <div className="w-full max-w-md h-2.5 rounded-full bg-gray-200 mb-6">
                                    <div className="bg-primary h-2.5 rounded-full w-1/3"></div>
                                </div>
                                <Skeleton className="h-4 w-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonLoading
'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import LebronRes from "@/components/lebronRes";
import EmotionBadge from "@/components/EmotionBadge";

interface Reflection {
    id: number;
    text: string;
    emotions: {
        [key: string]: number;
    };
    dominantEmotion: string;
    date: string;
}
interface LeBronResponse {
  response: string;
}


export default function ReflectionsPage() {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [loading, setLoading] = useState(true);
    const [lebronResponse, setLebronResponse] = useState<LeBronResponse | null>(null);

    
    // Format date 
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric', 
            minute: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    //inital render of relfections 
    useEffect(() => {
        const fetchReflections = async () => {
            try{
                //reflections
                const response = await fetch('http://localhost:5000/reflection');
                const data = await response.json();
                setReflections(data);       
                
                //lebron response
                const lebronRes = await fetch('http://localhost:5000/reflection/lebron-response');
                const lebronData = await lebronRes.json();
                setLebronResponse(lebronData);
            }
            catch (err){
                console.error('Error fetching reflections:', err);
            }finally{
                setLoading(false);
            }
        }
        fetchReflections();
    },[])    
    
    if (loading) {
        return (
        <div className="min-h-screen w-screen bg-yellow-50 py-20 flex items-center justify-center">
            <div className="text-amber-600 text-xl">Loading Lebron&apos;s wisdom...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-yellow-50 py-12">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Reflections</h1>
                    <Link href="/reflections/new">
                        <span className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                            Add New
                        </span>
                    </Link>
                </div>

                {lebronResponse && (
                    <LebronRes response={lebronResponse.response} />
                )}

                {/* Styled Charts Link - Simple Version */}
                <div className="my-6">
                    <Link 
                        href="/reflections/charts" 
                        className="flex items-center justify-center w-full py-3 px-4 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-200 transition-all shadow-sm hover:shadow group"
                    >
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </span>
                        <span className="font-medium">View Emotional Insights</span>
                        <span className="ml-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
                    </Link>
                </div>

                {/* All reflections with date and emotion */}
                <h2 className="text-xl font-semibold mb-4">Your Reflection Journal</h2>
                {reflections.length === 0 ? (
                    <p className="text-gray-600 mb-8">You haven&apos;t added any reflections yet. Start your journey!</p>
                ) : (
                    <ul className="space-y-4">
                        {reflections.map(reflection => (
                            <li key={reflection.id} className="p-4 bg-amber-50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="text-sm text-gray-500">
                                        {reflection.date && formatDate(reflection.date) }
                                    </div>
                                    {reflection.dominantEmotion && (
                                        <EmotionBadge emotion={reflection.dominantEmotion} />
                                    )}
                                </div>
                                <p className="text-gray-800">{reflection.text}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Back to Home Button */}
            <Link href="/" className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50">
                ← Home
            </Link>
        </div>
    );
}
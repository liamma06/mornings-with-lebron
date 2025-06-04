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
            <div className="text-amber-600 text-xl">Loading Lebron's wisdom...</div>
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

                {/* All reflections with date and emotion */}
                <h2 className="text-xl font-semibold mb-4">Your Reflection Journal</h2>
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
            </div>
        </div>
    );
}
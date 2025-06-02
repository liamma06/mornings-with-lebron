'use client';

import {useEffect, useState} from "react";

interface Reflection {
    id: number;
    text: string;
}


export default function ReflectionsPage() {
    const [reflections, setReflections] = useState<Reflection[]>([]);

    useEffect(() => {
        const fetchReflections = async () => {
            try{
                const response = await fetch('http://localhost:5000/reflection');

                const data = await response.json();
                setReflections(data);
            }
            catch (err){
                console.error('Error fetching reflections:', err);
            }
        }
        fetchReflections();
    },[])    
    
    function PostReflection() {
        return(
            <ul className="space-y-2">
                {reflections.map(reflection => (
                    <li key={reflection.id} className="p-3 bg-amber-50 rounded">
                        {reflection.text}
                    </li>
                ))}
            </ul>
        )

    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-yellow-50">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-4">Reflections</h1>
                <PostReflection />
            </div>
        </div>
    );
}
'use client';

import {useEffect, useState} from "react";
import Link from "next/link";

interface Reflection {
    id: number;
    text: string;
}


export default function ReflectionsPage() {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [newReflection, setNewReflection] = useState('');

    //inital render of relfections 
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
    

    return (
        <div className="min-h-screen w-screen bg-yellow-50 py-12">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Reflections</h1>
                    <Link href="/reflections/new">
                        <span className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                            Add New
                        </span>
                    </Link>
                </div>

                <ul className="space-y-2">
                    {reflections.map(reflection => (
                        <li key={reflection.id} className="p-3 bg-amber-50 rounded">
                            {reflection.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
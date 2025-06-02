'use client';

import { useState} from "react"
import {useRouter} from "next/navigation";

export default function NewReflection(){
    const [newReflection, setNewReflection] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try{
            const response = await fetch('http://localhost:5000/reflection/new',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newReflection
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit reflection');
            }
            router.push('/reflections');
        }catch(err){
            console.error('Error posting reflection:', err);
        }finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-yellow-50 py-12">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-4">Add New Reflection</h1>
                
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="mt-6">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Share your reflection..."
                            rows={4}
                            value={newReflection}
                            onChange={(e) => setNewReflection(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newReflection.trim()}
                            className={`px-6 py-2 ${isSubmitting || !newReflection.trim() 
                                ? 'bg-amber-300 cursor-not-allowed' 
                                : 'bg-amber-500 hover:bg-amber-600'} 
                                text-white rounded-lg transition-colors`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Reflection'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
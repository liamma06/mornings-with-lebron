import React from "react"
import Link from "next/link"

export default function Header(){
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 py-4 px-6 border-b border-amber-300/50 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-lg md:text-xl font-normal tracking-tight text-amber-600">
                    Mornings <span className="font-medium">with LeBron</span>
                </div>
                <Link href="/reflections "className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium transition-colors">
                    Get Started
                </Link>
            </div>
        </header>
    )
}
import Image from "next/image";
import React from "react";
import { FlipWords } from "../components/ui/flip-words";
  
export default function Home() {
  const words = ["Lebron", "the Goat", "the KING", "Sunshine"];
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 py-4 px-6 border-b border-amber-300/50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-lg md:text-xl font-normal tracking-tight text-amber-600">
            Mornings <span className="font-medium">with LeBron</span>
          </div>
          <button className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium transition-colors">
            Get Started
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="min-h-screen w-screen overflow-hidden bg-yellow-50 flex justify-center items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="text-left md:text-left flex flex-col justify-center">
            <p className="text-6xl md:text-7xl font-light tracking-tight text-neutral-800">
              Wake up to
            </p>
            <div className="mt-4">
              <FlipWords 
                words={words} 
                className="text-7xl md:text-8xl font-extrabold text-amber-500" 
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-amber-200 rounded-2xl w-full h-[440px] p-5 relative">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/LebronDance.gif"
                  alt="LeBron James"
                  fill
                  className="object-cover scale-125 object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

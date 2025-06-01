import Image from "next/image";
import React from "react";
import { FlipWords } from "../components/ui/flip-words";
  
export default function Home() {
  const words = ["Lebron", "the Goat", "the KING", "Sunshine"];
  return (
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
  );
}

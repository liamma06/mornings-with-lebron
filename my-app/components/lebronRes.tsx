"use client";
import Image from "next/image";

interface LebronResProps {
  response: string;
}

export default function LebronRes(props:LebronResProps){
    return(
        <div className="mb-10 bg-gradient-to-r from-amber-100 to-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <Image 
                  src="/lebron-profile.jpg" 
                  alt="LeBron James" 
                  width={48} 
                  height={48}
                  className="object-cover h-full w-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800">LeBron&apos;s Advice</h3>
                <p className="text-neutral-700 italic mt-2">{props.response}</p>
              </div>
            </div>
        </div>
    )
}
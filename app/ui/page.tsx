"use client";

import React from "react";
import { VscRobot } from "react-icons/vsc";

export default function IntroPage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b lg:bg-gradient-to-r from-violet-600 to-violet-800 px-4 overflow-hidden">

      {/* Background Robots */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <VscRobot className="text-white opacity-10 text-[30vw] absolute top-10 left-10 rotate-12" />
        <VscRobot className="text-white opacity-10 text-[20vw] absolute bottom-20 right-10 -rotate-12" />
        <VscRobot className="text-white opacity-10 text-[25vw] absolute top-1/3 right-1/4 rotate-45" />
        <VscRobot className="text-white opacity-10 text-[15vw] absolute bottom-10 left-1/4 -rotate-45" />
        <VscRobot className="text-white opacity-10 text-[15vw] absolute top-20 right-12" />
      </div>

      {/* Main Content Centered */}
      <div className="z-10 flex flex-col items-center justify-center text-white text-center max-w-3xl mx-auto min-h-screen space-y-4">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-tight drop-shadow-xl">
          AI Powered
        </h1>

        <p className="text-sm md:text-lg lg:text-2xl text-gray-100 font-medium px-2">
          GitHub Repo README File Generator using AI
        </p>

        <a
          href="./ui/readme"
          className="bg-white text-yellow-600 px-6 py-3 lg:px-12 lg:py-4 rounded-lg font-semibold text-md lg:text-xl shadow-md hover:bg-yellow-100 transition-all duration-300"
        >
          Get Started
        </a>
      </div>

      {/* Fixed Author Footer */}
      <div className="fixed bottom-4 left-0 w-full text-center z-20">
        <p className="inline-block px-6 py-3 text-sm sm:text-base font-semibold text-gray-700 bg-gradient-to-r from-white via-gray-100 to-white rounded-xl shadow-md border border-gray-200 mx-auto">
          🚀 Designed & Developed with ❤️ by <span className="text-indigo-600"><a href="https://eswarb.vercel.app/">Eswar</a></span>
        </p>
      </div>
    </div>
  );
}

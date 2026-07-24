"use client"
import Link from "next/link"
import { ChartColumn } from "lucide-react"

export default function LandingPage() {

  return (
    <div className="flex flex-col h-screen items-center justify-center">
        <div className="w-full absolute top-50 left-70 p-4 z-10"> 
        <ChartColumn size={400} className="text-blue-700 dark:text-blue-500 opacity-20 absolute" />
        </div>
      <p className="text-md text-neutral-500 z-20">One link. Real answers.</p>
      <p className="mb-5 text-md text-neutral-500 z-20">Get feedback with low barrier </p>
      <h1 className="text-blue-900 text-8xl font-bold z-20">Blind<span className="text-blue-700">Note</span></h1>
        

        <Link href="/feedback" className="bg-blue-700 hover:bg-blue-700 m-10 text-blue-100 text-xl font-bold py-3 px-6 rounded-xl z-20">
          Get Started
        </Link>
    </div>
  )
}
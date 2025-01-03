"use client"

import { useState, useEffect } from "react"

export default function Countdown () {

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date(2025, 0, 13, 10).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now
      if (distance < 0) {
        clearInterval(interval)
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        return
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeRemaining({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex gap-4 text-black">
        <div className="bg-gray-100 px-6 py-4 rounded-lg shadow-md flex flex-col items-center lg:px-12 lg:py-8">
          <div className="text-4xl font-bold lg:text-5xl">{timeRemaining.days}</div>
          <div className="text-sm text-gray-500 lg:text-lg">Days</div>
        </div>
        <div className="bg-gray-100 px-6 py-4 rounded-lg shadow-md flex flex-col items-center lg:px-12 lg:py-8">
          <div className="text-4xl font-bold lg:text-5xl">{timeRemaining.hours}</div>
          <div className="text-sm text-gray-500 lg:text-lg">Hours</div>
        </div>
        <div className="bg-gray-100 px-6 py-4 rounded-lg shadow-md flex flex-col items-center lg:px-12 lg:py-8">
          <div className="text-4xl font-bold lg:text-5xl">{timeRemaining.minutes}</div>
          <div className="text-sm text-gray-500 lg:text-lg">Minutes</div>
        </div>
      </div>
    </div>
  )
}
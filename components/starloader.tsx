"use client"

export default function StarLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          viewBox="0 0 120 120"
          className="w-24 h-24 sm:w-32 sm:h-32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle */}
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="url(#grad)"
            strokeWidth="4"
            fill="none"
          />

          {/* 5-pointed Star Path */}
          <path
            d="M60,20
               L70,45
               L97,45
               L75,63
               L82,90
               L60,74
               L38,90
               L45,63
               L23,45
               L50,45
               Z"
            stroke="#facc15"        // yellow-400
            strokeWidth="3"
            fill="none"
            strokeDasharray="500"
            strokeDashoffset="500"
            style={{
              animation: "drawStar 1.5s ease-in-out infinite",
            }}
          />

          {/* Gradient for circle */}
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>

          <style>
            {`
              @keyframes drawStar {
                0% {
                  stroke-dashoffset: 500;
                }
                100% {
                  stroke-dashoffset: 0;
                }
              }
            `}
          </style>
        </svg>
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-red-600 mt-4 font-medium text-center">
        Loading...
      </h2>
    </div>
  )
}
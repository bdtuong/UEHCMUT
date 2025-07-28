"use client"

export default function StarLoader() {
  return (
    <div className="flex-col items-center justify-center h-48 w-48">
      <svg
        viewBox="0 0 120 120"
        width="120"
        height="120"
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
            animation: "drawStar 2.5s ease-in-out infinite",
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
      <h2 className="text-3xl items-center text-red-600 py-4">Loading...</h2>
    </div>
    
  )
}

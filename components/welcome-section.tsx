"use client"

export default function WelcomeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-center gap-12">

        {/* Text box */}
        <div className="relative max-w-md px-6 py-8 rounded-xl">
        {/* Frame corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-black" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-black" />

        {/* Content */}
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Welcome to 
            <span className="relative text-red-500 hover:text-yellow-400 transition-colors duration-300 group">
            LanternVerse
            <span className="absolute inset-0 w-full h-full pointer-events-none group-hover:animate-sparkle bg-gradient-to-r from-yellow-200 via-white to-yellow-300 bg-clip-text text-transparent opacity-0 group-hover:opacity-100" />
        </span>

        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
            Journey into the heart of Vietnam’s traditional lantern craft. At LanternVerse, we celebrate the timeless glow, intricate artistry, and cultural soul of Saigon’s historic lantern villages.
        </p>
        </div>


        {/* Images */}
        <div className="flex items-center justify-center gap-6">
          {/* Left-side single image */}
          <img
            src="/welcome-section/wc-lantern-1.jpg"
            alt="Lantern 1"
            className="w-44 h-72 object-cover rounded-xl shadow-lg"
          />

          {/* Right-side stacked images */}
          <div className="flex flex-col gap-6">
            <img
              src="/welcome-section/wc-lantern-2.jpg"
              alt="Lantern 2"
              className="w-44 h-72 object-cover rounded-xl shadow-lg"
            />
            <img
              src="/welcome-section/wc-lantern-3.jpg"
              alt="Lantern 3"
              className="w-44 h-72 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        
      </div>
    </section>
  )
}

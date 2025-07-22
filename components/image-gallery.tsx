"use client"

export default function ImageGallery() {
  const images = [
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Traditional lanterns illuminate the ancient streets of Hoi An",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Master craftsmen preserve centuries-old techniques",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Lantern festivals create magical moments under the full moon",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Each lantern tells a unique story through color and design",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Heritage architecture enhanced by traditional lighting",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      caption: "Premium silk and bamboo - the essence of authentic craftsmanship",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">A Journey Through Light</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the beauty and craftsmanship that makes each Hoi An lantern a masterpiece
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.caption}
                className="w-full h-80 object-cover filter sepia-[0.2] contrast-125 group-hover:sepia-0 group-hover:contrast-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                <p className="text-sm leading-relaxed">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'

export default function LanternMakingGuide() {
  const steps = [
    {
      title: 'Prepare Materials',
      desc: 'Use dried bamboo strips, colored cellophane paper, glue, thin wires, scissors, and decorations like glitter or colored paper.',
      image: '/guide/1.jpg',
    },
    {
      title: 'Build the Bamboo Frame',
      desc: 'Bend the bamboo into the desired shape (star, fish, chicken...) and secure the frame with glue and wire.',
      image: '/guide/2.jpg',
    },
    {
      title: 'Apply the Cellophane',
      desc: 'Cut cellophane to fit each side of the frame and carefully glue it on. Trim and reinforce edges with colored paper or tape.',
      image: '/guide/3.jpg',
    },
    {
      title: 'Decorate Your Lantern',
      desc: 'Add facial features, tails, fins, or wings using paper, glitter, or drawings. Express your creativity with Vietnamese folk flair.',
      image: '/guide/4.jpg',
    },
    {
      title: 'Attach Handle and Light Source',
      desc: 'Attach a bamboo stick for carrying or a hook for hanging. Use a small candle (traditional) or LED light (modern, safe).',
      image: '/guide/5.jpg',
    },
    {
      title: 'Finish and Test the Lantern',
      desc: 'Check for stability, fix any loose parts, and test how it lights up. Make sure it’s both beautiful and safe to use.',
      image: '/guide/6.jpg',
    },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  return (
    <section className="bg-black text-red-200 py-20 px-6 md:px-12 lg:px-24 border-t border-red-600/30">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          How to Make a Traditional Lantern
        </h2>
        <p className="mt-4 text-red-300 max-w-2xl mx-auto text-lg leading-relaxed">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Instructional Video */}
<div className="max-w-3xl mx-auto mb-10">
  <video
    src="/diy.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full rounded-2xl border border-red-500/20 shadow-2xl"
  />
</div>


      {/* Step Content */}
      <div className="max-w-2xl mx-auto text-center">
        <img
          src={step.image}
          alt={step.title}
          className="w-full max-h-72 object-cover rounded-2xl mb-6 border border-red-500/30 shadow-xl"
        />
        <h3 className="text-2xl font-semibold text-red-400 mb-2">{step.title}</h3>
        <p className="text-red-200 text-base leading-relaxed">{step.desc}</p>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed border-red-600 text-red-600'
                : 'border-red-600 text-red-200 hover:bg-red-600 hover:text-black'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={currentStep === steps.length - 1}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              currentStep === steps.length - 1
                ? 'opacity-30 cursor-not-allowed border-red-600 text-red-600'
                : 'border-red-600 text-red-200 hover:bg-red-600 hover:text-black'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

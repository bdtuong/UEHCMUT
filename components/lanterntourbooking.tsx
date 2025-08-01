'use client'

import { useState } from 'react'

export default function LanternTourBooking() {
  const [participants, setParticipants] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('18:00')

  return (
    <section className="bg-black text-red-200 py-16 px-6 md:px-12 lg:px-24 shadow-inner border-t border-red-600/30">
      {/* Section Title */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          Book Your Lantern Street Tour
        </h2>
        <p className="mt-4 text-red-300 max-w-xl mx-auto text-lg leading-relaxed">
          Step into the glowing heart of Vietnam’s lantern traditions. Join a magical night walk, create your own lantern, and meet local artisans keeping this heritage alive.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { title: 'Lantern Workshop', img: '/booking/workshop.jpg' },
          { title: 'Meet Artisans', img: '/booking/artist.jpg' },
          { title: 'Night Street Walk', img: '/booking/night.jpg' },
          { title: 'Photo Zones', img: '/booking/photo.jpg' },
        ].map(({ title, img }, idx) => (
          <div key={idx} className="bg-gray-900/70 backdrop-blur-md rounded-2xl overflow-hidden border border-red-700/20 shadow-lg">
            <img src={img} alt={title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-red-400">{title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form */}
      <div className="bg-gray-900/70 backdrop-blur-md border border-red-600/30 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto shadow-xl">
        <h3 className="text-2xl font-bold text-red-500 text-center mb-6">Reserve Your Spot</h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Date */}
  <div>
    <label className="block text-sm text-red-300 mb-1">Select Date</label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100 placeholder:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
    />
  </div>

  {/* Time */}
  <div>
    <label className="block text-sm text-red-300 mb-1">Time Slot</label>
    <select
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
    >
      <option>18:00</option>
      <option>19:30</option>
      <option>21:00</option>
    </select>
  </div>

  {/* Location */}
  <div className="md:col-span-2">
    <label className="block text-sm text-red-300 mb-1">Choose Location</label>
    <select
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
    >
      <option value="">-- Select a craft village --</option>
      <option value="phu-binh">Phú Bình Village</option>
      <option value="luong-nhu-hoc">Lương Nhữ Học Street</option>
    </select>
  </div>

  {/* Participants */}
  <div>
    <label className="block text-sm text-red-300 mb-1">Number of Participants</label>
    <input
      type="number"
      min={1}
      value={participants}
      onChange={(e) => setParticipants(+e.target.value)}
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
    />
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm text-red-300 mb-1">Your Email</label>
    <input
      type="email"
      placeholder="you@example.com"
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
    />
  </div>

  {/* Description */}
  <div className="md:col-span-2">
    <label className="block text-sm text-red-300 mb-1">Message or Special Request</label>
    <textarea
      rows={4}
      placeholder="E.g. I'd love to make a dragon-shaped lantern!"
      className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
    ></textarea>
  </div>

  {/* Submit */}
  <div className="md:col-span-2 text-center mt-4">
    <button
      type="submit"
      className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
    >
      Book Now
    </button>
  </div>
</form>

      </div>

      {/* Testimonials */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h4 className="text-xl font-semibold text-center text-red-500 mb-6">✨ What Visitors Say</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-red-100">
          <div className="bg-gray-900 p-5 rounded-xl border border-red-700/20">
            <p>“This tour brought me back to my childhood. Making a lantern with my daughter was unforgettable!”</p>
            <div className="mt-2 text-yellow-400">★★★★★</div>
          </div>
          <div className="bg-gray-900 p-5 rounded-xl border border-red-700/20">
            <p>“The streets were glowing, the guides were kind, and the experience was deeply cultural.”</p>
            <div className="mt-2 text-yellow-400">★★★★★</div>
          </div>
        </div>
      </div>

      {/* Workshop Booking */}
<div className="mt-24 max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-md border border-red-600/30 rounded-2xl p-6 md:p-10 shadow-xl">
  <h3 className="text-2xl font-bold text-red-500 text-center mb-6">Join a Hands-on Lantern Workshop</h3>
  <p className="text-red-300 text-center mb-8 text-sm">
    Learn directly from artisans. Choose your favorite lantern and create it step-by-step!
  </p>

  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Lantern Type */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Lantern Type</label>
      <select className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100">
        <option value="">-- Choose a shape --</option>
        <option value="star">⭐ Star Lantern</option>
        <option value="carp">🐟 Carp Lantern</option>
        <option value="rabbit">🐇 Rabbit Lantern</option>
        <option value="custom">🎨 DIY Freestyle</option>
      </select>
    </div>

    {/* Age Group */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Participant Age</label>
      <select className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100">
        <option value="">-- Select age range --</option>
        <option value="child">5–12 years old</option>
        <option value="teen">13–17 years old</option>
        <option value="adult">18+ years old</option>
      </select>
    </div>

    {/* Workshop Date */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Select Workshop Date</label>
      <input
        type="date"
        className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
      />
    </div>

    {/* Workshop Time */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Workshop Time</label>
      <select className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100">
        <option>08:00 – 10:00</option>
        <option>13:30 – 15:30</option>
        <option>16:00 – 18:00</option>
      </select>
    </div>

    {/* Name */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Full Name</label>
      <input
        type="text"
        placeholder="Your name"
        className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
      />
    </div>

    {/* Phone */}
    <div>
      <label className="block text-sm text-red-300 mb-1">Phone Number</label>
      <input
        type="tel"
        placeholder="e.g. +84 912 345 678"
        className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100"
      />
    </div>

    {/* Notes */}
    <div className="md:col-span-2">
      <label className="block text-sm text-red-300 mb-1">Special Request</label>
      <textarea
        rows={3}
        placeholder="Let us know if you have any preferences..."
        className="w-full bg-black border border-red-600 rounded-lg px-4 py-2 text-red-100 resize-none"
      ></textarea>
    </div>

    {/* Submit */}
    <div className="md:col-span-2 text-center mt-4">
      <button
        type="submit"
        className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
      >
        Sign Up for Workshop
      </button>
    </div>
  </form>
</div>

    </section>
  )
}

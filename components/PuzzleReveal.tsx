'use client';

import React, { useEffect, useState } from 'react';

type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

interface Reward {
  icon: string;
  text: string;
  rarity: RarityType;
}

const rewards: Reward[] = [
  // Common rewards (60%)
  { icon: '🎫', text: '1/4 Discount Voucher', rarity: 'common' },
  { icon: '🎟️', text: '1/4 Discount Voucher', rarity: 'common' },
  { icon: '💳', text: '1/4 Discount Voucher', rarity: 'common' },
  { icon: '🏷️', text: '1/4 Discount Voucher', rarity: 'common' },
  { icon: '🎫', text: '1/4 Design Lantern Voucher', rarity: 'common' },
  { icon: '🎟️', text: '1/4 Design Lantern Voucher', rarity: 'common' },
  
  // Rare rewards (25%)
  { icon: '🎗️', text: '1/2 Discount Voucher', rarity: 'rare' },
  { icon: '🎪', text: '1/2 Discount Voucher', rarity: 'rare' },
  { icon: '🏮', text: '1/2 Design Lantern Voucher', rarity: 'rare' },
  { icon: '🎨', text: '1/2 Design Lantern Voucher', rarity: 'rare' },
  { icon: '🎫', text: '1/4 Lantern Village Tour', rarity: 'rare' },
  { icon: '🗺️', text: '1/4 Lantern Village Tour', rarity: 'rare' },
  
  // Epic rewards (12%)
  { icon: '🎊', text: 'Full Discount Voucher', rarity: 'epic' },
  { icon: '💎', text: 'Full Design Lantern Voucher', rarity: 'epic' },
  { icon: '🏛️', text: '1/2 Lantern Village Tour', rarity: 'epic' },
  { icon: '🎭', text: 'Premium Lantern Workshop', rarity: 'epic' },
  
  // Legendary rewards (3%)
  { icon: '👑', text: 'VIP Complete Package', rarity: 'legendary' },
  { icon: '🌟', text: 'Full Lantern Village Tour', rarity: 'legendary' },
  { icon: '🏆', text: 'Master Craftsman Session', rarity: 'legendary' },
  { icon: '💰', text: 'Golden Lantern Collection', rarity: 'legendary' },
];

const tileColors = [
  'from-yellow-400 to-amber-500',
  'from-purple-400 to-violet-600',
  'from-green-400 to-emerald-500',
  'from-red-400 to-rose-500',
  'from-blue-500 to-blue-600',
  'from-pink-400 to-fuchsia-500',
  'from-orange-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-indigo-400 to-indigo-600',
];

const rarityColors: Record<RarityType, string> = {
  common: 'from-gray-500 to-gray-700',
  rare: 'from-blue-500 to-blue-700',
  epic: 'from-purple-500 to-purple-700',
  legendary: 'from-yellow-500 to-orange-600'
};

export default function PuzzleReveal() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [rewardMessage, setRewardMessage] = useState<Reward | null>(null);
  const [rewardHistory, setRewardHistory] = useState<Reward[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalTiles = 100;

  // Function to get remaining unrevealed tiles
  const getRemainingTiles = (): number[] => {
    const allTiles = Array.from({ length: totalTiles }, (_, i) => i);
    return allTiles.filter(tile => !revealedTiles.includes(tile));
  };

  // Function to get random tile from remaining tiles
  const getRandomTileIndex = (): number => {
    const remainingTiles = getRemainingTiles();
    if (remainingTiles.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * remainingTiles.length);
    return remainingTiles[randomIndex];
  };

  // Function to get reward based on rarity system
  const getRandomReward = (): Reward => {
    const rand = Math.random();
    let rarityPool: Reward[];
    
    if (rand < 0.03) { // 3% legendary
      rarityPool = rewards.filter(r => r.rarity === 'legendary');
    } else if (rand < 0.15) { // 12% epic
      rarityPool = rewards.filter(r => r.rarity === 'epic');
    } else if (rand < 0.40) { // 25% rare
      rarityPool = rewards.filter(r => r.rarity === 'rare');
    } else { // 60% common
      rarityPool = rewards.filter(r => r.rarity === 'common');
    }
    
    return rarityPool[Math.floor(Math.random() * rarityPool.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      if ((elapsedTime + 1) % 1 === 0 && revealedTiles.length < totalTiles) {
        const randomTileIndex = getRandomTileIndex();
        
        if (randomTileIndex !== -1) {
          setRevealedTiles((prev) => [...prev, randomTileIndex]);
          
          const randomReward = getRandomReward();
          setRewardMessage(randomReward);
          setRewardHistory((prev) => [...prev, randomReward]);
          setProgress(((revealedTiles.length + 1) / totalTiles) * 100);

          setTimeout(() => setRewardMessage(null), 4000);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedTime, revealedTiles]);

  return (
    <div className="min-h-screen bg-black text-red-500">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-4">
            Mystery Puzzle
          </h1>
          <p className="text-xl text-red-300 max-w-2xl mx-auto">
            Each day reveals a random puzzle piece! Collect exclusive lantern rewards as you discover the hidden image
          </p>
        </div>

        <div className="max-w-full mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
            
            {/* Puzzle Image - 70% width on desktop, full width on mobile */}
            <div className="w-full lg:w-[70%] flex items-center justify-center py-8">
              <div className="relative w-full max-w-2xl lg:max-w-2xl">
                <div className="bg-black/80 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-red-500/30 shadow-2xl">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-red-500/50">
                    <img
                      src="/secret.png"
                      alt="Hidden Reward"
                      className="w-full h-full object-cover"
                    />

                    {/* Puzzle Tiles - 10x10 grid */}
                    {[...Array(totalTiles)].map((_, index) => (
                      <div
                        key={index}
                        className={`absolute transition-all duration-1000 ease-out transform ${
                          revealedTiles.includes(index) 
                            ? 'opacity-0 scale-110 rotate-12' 
                            : 'opacity-95 scale-100 rotate-0'
                        } bg-gradient-to-br ${tileColors[index % tileColors.length]} shadow-sm border border-red-500/10`}
                        style={{
                          width: '10%',
                          height: '10%',
                          top: `${Math.floor(index / 10) * 10}%`,
                          left: `${(index % 10) * 10}%`,
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1 h-1 md:w-2 md:h-2 bg-red-500/30 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    ))}

                    {/* Sparkle Effects - more dynamic */}
                    {revealedTiles.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 md:w-2 md:h-2 bg-red-400 rounded-full animate-ping"
                            style={{
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: `${1 + Math.random()}s`
                            }}
                          ></div>
                        ))}
                        
                        {/* Additional sparkles on newly revealed tiles */}
                        {revealedTiles.slice(-3).map((tileIndex, i) => (
                          <div
                            key={`new-${tileIndex}`}
                            className="absolute w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-bounce"
                            style={{
                              top: `${Math.floor(tileIndex / 10) * 10 + 5}%`,
                              left: `${(tileIndex % 10) * 10 + 5}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '2s'
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>

                  {revealedTiles.length === totalTiles && (
                    <div className="mt-4 md:mt-6 text-center p-4 md:p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white shadow-lg animate-pulse border border-red-400">
                      <div className="text-2xl md:text-4xl mb-2 md:mb-3">🎉</div>
                      <div className="font-bold text-lg md:text-2xl">Congratulations!</div>
                      <div className="text-sm md:text-lg">You've unlocked everything!</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Timer and Rewards - 30% width on desktop, stacked on mobile */}
            <div className="w-full lg:w-[30%] flex flex-col gap-4 md:gap-6 py-4 lg:py-8">
              
              {/* Timer and Progress Panel */}
<div className="flex-1 min-h-0">
  <div className="bg-black/80 backdrop-blur-lg rounded-2xl border border-red-500/30 shadow-2xl h-full p-4 sm:p-6 flex flex-col justify-between">
    
    {/* Time on site */}
    <div className="text-center mb-6">
      <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
        {Math.floor(elapsedTime)} missions
      </div>
      
    </div>

    {/* Progress */}
    <div className="mb-6">
      <div className="flex justify-between text-xs md:text-sm text-red-300 mb-2 md:mb-3">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 md:h-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
      <div className="bg-black/50 rounded-xl p-3 md:p-5 border border-red-500/20 text-center">
        <div className="text-xl md:text-3xl font-bold text-red-400">{revealedTiles.length}</div>
        <div className="text-sm md:text-base text-red-300">Rewards</div>
      </div>
      <div className="bg-black/50 rounded-xl p-3 md:p-5 border border-red-500/20 text-center">
        <div className="text-xl md:text-3xl font-bold text-red-400">{getRemainingTiles().length}</div>
        <div className="text-sm md:text-base text-red-300">Left</div>
      </div>
    </div>
  </div>
</div>


              {/* Reward History Panel */}
              <div className="flex-1 min-h-0">
                <div className="bg-black/80 backdrop-blur-lg rounded-2xl border border-red-500/30 shadow-2xl overflow-hidden h-full max-h-[400px] lg:max-h-[500px] flex flex-col">
                  

  <div className="flex-1 overflow-y-auto bg-black/50 min-h-0 max-h-72">
    <div className="p-3 md:p-6">
      {rewardHistory.length === 0 ? (
        <div className="text-center text-red-400 py-6 md:py-12">
          <div className="text-3xl md:text-6xl mb-2 md:mb-4">🎁</div>
          <p className="text-red-300 text-sm md:text-lg">No rewards yet...</p>
          <p className="text-xs md:text-sm text-red-400 mt-1 md:mt-2">Stay longer to earn rewards!</p>
        </div>
      ) : (
        <div className="space-y-2 md:space-y-4">
          {rewardHistory.map((reward, index) => (
            <div
              key={index}
              className={`p-3 md:p-4 rounded-lg bg-gradient-to-r ${rarityColors[reward.rarity]} text-white shadow-md transform hover:scale-105 transition-transform duration-200 border border-red-500/20 flex-shrink-0`}
            >
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xl md:text-3xl flex-shrink-0">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-red-100 text-xs md:text-base truncate">{reward.text}</div>
                  <div className="text-xs md:text-sm text-red-200 uppercase tracking-wider mt-1">
                    {reward.rarity}
                  </div>
                </div>
                <div className="text-xs md:text-sm text-red-300 font-bold flex-shrink-0">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>


                </div>
              </div>
            </div>
          </div>

          {/* Current Reward - Center screen overlay with better animation */}
          {rewardMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-black/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-red-500/60 shadow-2xl animate-pulse max-w-sm mx-4 pointer-events-auto transform scale-110">
                <div className={`text-center p-6 md:p-8 rounded-2xl bg-gradient-to-r ${rarityColors[rewardMessage.rarity]} text-white shadow-xl border-2 border-yellow-400/50 relative overflow-hidden`}>
                  {/* Sparkle overlay */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl mb-4 animate-bounce">{rewardMessage.icon}</div>
                    <div className="font-bold text-xl md:text-2xl text-yellow-100 mb-2">🎊 NEW REWARD! 🎊</div>
                    <div className="text-lg md:text-xl text-white font-semibold mb-3">{rewardMessage.text}</div>
                    <div className="text-sm md:text-base mt-3 uppercase tracking-widest text-yellow-200 font-bold border-t border-white/30 pt-3">
                      ✨ {rewardMessage.rarity} ✨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
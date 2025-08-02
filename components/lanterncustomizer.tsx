'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

// TYPES
type Point = { x: number; y: number };
type Sticker = { src: string; x: number; y: number; scale: number; rotation: number };
type Mode = 'draw' | 'drag';

export default function ModernLanternDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const designerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [controlPoints, setControlPoints] = useState<Point[]>([]);
  const [draggingCPIndex, setDraggingCPIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fillColor, setFillColor] = useState('rgba(239, 68, 68, 0.3)');
  const [isShapeClosed, setIsShapeClosed] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [draggingStickerIndex, setDraggingStickerIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('draw');
  const [selectedStickerIndex, setSelectedStickerIndex] = useState<number | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cp = controlPoints[i - 1] || points[i - 1];
      ctx.quadraticCurveTo(cp.x, cp.y, points[i].x, points[i].y);
    }
    if (isShapeClosed && points.length >= 3) {
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Control points with glow effect
    controlPoints.forEach((cp) => {
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Main points with glow effect
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw stickers
    stickers.forEach((sticker, index) => {
      const stickerEmoji = ['⭐', '🐟', '🌙', '🎋', '🏮', '🌸'][index % 6];
      const w = 40 * sticker.scale;
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate(sticker.rotation);
      ctx.font = `${w}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 5;
      ctx.fillText(stickerEmoji, 0, 0);
      ctx.restore();
    });
  }, [points, controlPoints, fillColor, isShapeClosed, stickers]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const requestFullscreen = async () => {
    const element = designerRef.current;
    if (!element) return false;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      } else {
        return false;
      }
      setIsFullscreen(true);
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      return false;
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  };

  const handleStartDesign = async () => {
    setStarted(true);
    
    // Small delay to ensure the design interface is rendered
    setTimeout(async () => {
      if (designerRef.current) {
        try {
          if (designerRef.current.requestFullscreen) {
            await designerRef.current.requestFullscreen();
          } else if ((designerRef.current as any).webkitRequestFullscreen) {
            await (designerRef.current as any).webkitRequestFullscreen();
          } else if ((designerRef.current as any).mozRequestFullScreen) {
            await (designerRef.current as any).mozRequestFullScreen();
          } else if ((designerRef.current as any).msRequestFullscreen) {
            await (designerRef.current as any).msRequestFullscreen();
          }
          setIsFullscreen(true);
        } catch (err) {
          console.warn("Failed to enter fullscreen:", err);
        }
      }
    }, 100);
  };

  const handleBackToWelcome = async () => {
    if (isFullscreen && document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (err) {
        console.warn("Failed to exit fullscreen:", err);
      }
    }
    
    setStarted(false);
    setIsFullscreen(false);
    // Reset all states
    handleReset();
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw' || isShapeClosed) return;
    const { x, y } = getCanvasCoordinates(e);
    if (!isDrawing) {
      setPoints([{ x, y }]);
      setControlPoints([]);
      setIsDrawing(true);
    } else {
      const last = points[points.length - 1];
      setPoints((prev) => [...prev, { x, y }]);
      setControlPoints((prevCP) => [...prevCP, { x: (last.x + x) / 2, y: (last.y + y) / 2 }]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    if (mode !== 'drag') return;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const w = 40 * s.scale;
      const h = 40 * s.scale;
      if (x >= s.x - w / 2 && x <= s.x + w / 2 && y >= s.y - h / 2 && y <= s.y + h / 2) {
        setDraggingStickerIndex(i);
        setSelectedStickerIndex(i);
        return;
      }
    }
    setSelectedStickerIndex(null);

    for (let i = 0; i < controlPoints.length; i++) {
      const cp = controlPoints[i];
      if ((cp.x - x) ** 2 + (cp.y - y) ** 2 < 100) {
        setDraggingCPIndex(i);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    if (draggingCPIndex !== null) {
      setControlPoints((prev) => {
        const newCPs = [...prev];
        newCPs[draggingCPIndex] = { x, y };
        return newCPs;
      });
    } else if (draggingStickerIndex !== null) {
      setStickers((prev) => {
        const newStickers = [...prev];
        newStickers[draggingStickerIndex] = { ...newStickers[draggingStickerIndex], x, y };
        return newStickers;
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (draggingStickerIndex !== null || selectedStickerIndex !== null) {
      const targetIndex = draggingStickerIndex !== null ? draggingStickerIndex : selectedStickerIndex;
      setStickers((prev) => {
        const newStickers = [...prev];
        const s = newStickers[targetIndex!];
        if (e.shiftKey) {
          s.rotation += (e.deltaY > 0 ? 0.1 : -0.1);
        } else {
          s.scale = Math.max(0.2, Math.min(3, s.scale + (e.deltaY > 0 ? -0.1 : 0.1)));
        }
        return newStickers;
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingCPIndex(null);
    setDraggingStickerIndex(null);
  };

  const handleCloseShape = () => {
    if (points.length >= 3) {
      setIsDrawing(false);
      setIsShapeClosed(true);
    }
  };

  const handleReset = () => {
    setPoints([]);
    setControlPoints([]);
    setIsDrawing(false);
    setIsShapeClosed(false);
    setStickers([]);
    setSelectedStickerIndex(null);
  };

  const handleUndo = () => {
    if (points.length > 0) {
      setPoints((prev) => prev.slice(0, -1));
      setControlPoints((prev) => prev.slice(0, -1));
      if (points.length === 1) {
        setIsDrawing(false);
      }
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'custom-lantern-design.png';
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleColorChange = (color: string) => setFillColor(color);
  
  const handleAddSticker = (stickerType: string) => {
    setStickers([...stickers, { src: stickerType, x: 400, y: 250, scale: 1, rotation: 0 }]);
  };

  const handleStickerScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedStickerIndex !== null) {
      const newScale = parseFloat(e.target.value);
      setStickers((prev) => {
        const newStickers = [...prev];
        newStickers[selectedStickerIndex] = { ...newStickers[selectedStickerIndex], scale: newScale };
        return newStickers;
      });
    }
  };

  const handleDeleteSticker = () => {
    if (selectedStickerIndex !== null) {
      setStickers((prev) => prev.filter((_, index) => index !== selectedStickerIndex));
      setSelectedStickerIndex(null);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
  <div className="text-center max-w-4xl">
    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
      Modern Lantern Designer
    </h1>
    <p className="text-xl text-yellow-200 mb-8 leading-relaxed">
      Create stunning traditional lanterns with a modern digital twist. Design, customize, and bring your vision to life.
    </p>

    <div className="mb-10 relative">
      <div className="relative w-80 h-80 mx-auto rounded-full flex items-center justify-center border-4 border-yellow-500 overflow-hidden shadow-inner">
        <img
          src="/lanterndesign.jpg"
          alt="Lantern Preview"
          className="w-full h-full object-cover rounded-full z-10"
        />

        <div className="absolute inset-0 rounded-full border-4 border-transparent z-0 animate-spin-slow">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-50 blur-md" />
        </div>

        <style jsx>{`
          .animate-spin-slow {
            animation: spin 6s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>

      <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-3xl"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
      <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-500/20 backdrop-blur-sm">
        <div className="text-yellow-400 mb-3">🎨</div>
        <h3 className="font-semibold text-yellow-300 mb-2">Design Tools</h3>
        <p className="text-yellow-200 text-sm">Advanced drawing tools with curve control and real-time editing</p>
      </div>
      <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-500/20 backdrop-blur-sm">
        <div className="text-yellow-400 mb-3">✨</div>
        <h3 className="font-semibold text-yellow-300 mb-2">Custom Elements</h3>
        <p className="text-yellow-200 text-sm">Add decorative stickers with scaling and rotation controls</p>
      </div>
      <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-500/20 backdrop-blur-sm">
        <div className="text-yellow-400 mb-3">💾</div>
        <h3 className="font-semibold text-yellow-300 mb-2">Export Ready</h3>
        <p className="text-yellow-200 text-sm">Download your creations in high-quality PNG format</p>
      </div>
    </div>

    <button
      onClick={handleStartDesign}
      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-full text-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/25"
    >
      Start Creating
    </button>

    <p className="text-sm text-yellow-500 mt-4">Click to enter fullscreen design mode</p>
  </div>
</div>


    );
  }

  return (
    <div 
      ref={designerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'min-h-screen bg-black'} text-white overflow-auto`}
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-500 mb-2">
                Lantern Designer Studio {isFullscreen && <span className="text-lg text-green-400">[Fullscreen]</span>}
              </h1>
              <p className="text-gray-400">Create your custom traditional lantern design</p>
            </div>
            <div className="flex gap-3">
              {!isFullscreen && (
                <button
                  onClick={requestFullscreen}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  title="Enter Fullscreen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Fullscreen
                </button>
              )}
              <button
                onClick={handleBackToWelcome}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-600 hover:border-red-500/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Canvas Area */}
            <div className="flex-1">
              <div className="bg-gray-900 border-2 border-red-500/30 rounded-lg p-4 shadow-2xl">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  tabIndex={0}
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onWheel={handleWheel}
                  className="w-full cursor-crosshair outline-none rounded border border-gray-700"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className="mt-4 text-sm text-gray-400">
                  {mode === 'draw' 
                    ? "Click to add points. Use 'Lock Shape' when finished." 
                    : "Drag control points or stickers. Use mouse wheel to scale, Shift+wheel to rotate."
                  }
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="w-full xl:w-80 space-y-6">
              {/* Mode Selection */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setMode('draw')} 
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      mode === 'draw' 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Draw
                  </button>
                  <button 
                    onClick={() => setMode('drag')} 
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      mode === 'drag' 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Fill Colors</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Red', value: 'rgba(239, 68, 68, 0.3)', bg: 'bg-red-500' },
                    { name: 'Blue', value: 'rgba(59, 130, 246, 0.3)', bg: 'bg-blue-500' },
                    { name: 'Green', value: 'rgba(34, 197, 94, 0.3)', bg: 'bg-green-500' },
                    { name: 'Yellow', value: 'rgba(234, 179, 8, 0.3)', bg: 'bg-yellow-500' },
                    { name: 'Purple', value: 'rgba(168, 85, 247, 0.3)', bg: 'bg-purple-500' },
                    { name: 'Pink', value: 'rgba(236, 72, 153, 0.3)', bg: 'bg-pink-500' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorChange(color.value)}
                      className={`${color.bg} h-12 rounded-lg border-2 border-transparent hover:border-white/50 transition-all transform hover:scale-105`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Stickers */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-red-400">Decorations</h3>
                  <button 
                    onClick={() => setShowStickerPanel(!showStickerPanel)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {showStickerPanel ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showStickerPanel && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {['star', 'fish', 'moon', 'bamboo', 'lantern', 'flower'].map((sticker) => (
                        <button 
                          key={sticker}
                          onClick={() => handleAddSticker(sticker)}
                          className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-all transform hover:scale-105 border border-gray-600 hover:border-red-500/50"
                          title={`Add ${sticker}`}
                        >
                          <div className="text-2xl">
                            {sticker === 'star' && '⭐'}
                            {sticker === 'fish' && '🐟'}
                            {sticker === 'moon' && '🌙'}
                            {sticker === 'bamboo' && '🎋'}
                            {sticker === 'lantern' && '🏮'}
                            {sticker === 'flower' && '🌸'}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedStickerIndex !== null && (
                      <div className="space-y-2 pt-3 border-t border-gray-700">
                        <label className="text-sm text-gray-400">Selected Decoration Scale</label>
                        <input
                          type="range"
                          min="0.2"
                          max="3"
                          step="0.1"
                          value={stickers[selectedStickerIndex]?.scale || 1}
                          onChange={handleStickerScaleChange}
                          className="w-full accent-red-500"
                        />
                        <button
                          onClick={handleDeleteSticker}
                          className="w-full py-2 bg-red-600/20 text-red-400 rounded border border-red-600/50 hover:bg-red-600/30 transition-colors"
                        >
                          Delete Selected
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Actions</h3>
                
                <button 
                  onClick={handleCloseShape} 
                  disabled={points.length < 3 || isShapeClosed}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Lock Shape
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleUndo} 
                    disabled={points.length === 0}
                    className="py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Undo
                  </button>
                  <button 
                    onClick={handleReset}
                    className="py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                
                <button 
                  onClick={handleExport} 
                  disabled={!isShapeClosed && points.length === 0}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Download Design
                </button>
              </div>

              {/* Stats */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Stats</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>Points: {points.length}</div>
                  <div>Decorations: {stickers.length}</div>
                  <div>Status: {isShapeClosed ? 'Complete' : isDrawing ? 'Drawing' : 'Ready'}</div>
                  <div>Mode: {isFullscreen ? 'Fullscreen' : 'Window'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
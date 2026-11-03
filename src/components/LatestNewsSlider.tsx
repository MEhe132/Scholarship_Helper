'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Radio, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { latestNewsData } from '../data/latestNewsData';
import { LatestNewsItem } from '../lib/types';
import { useApp } from '../context/AppContext';

export default function LatestNewsSlider() {
  const { markNewsAsSeen, seenNewsIds } = useApp();
  const [newsList] = useState<LatestNewsItem[]>(latestNewsData);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Auto-scroll ticker every 6 seconds if not hovered
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section 
      className="relative mb-8 bg-gradient-to-b from-blue-50/70 to-indigo-50/30 rounded-2xl p-4 sm:p-6 border border-blue-100/80 shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header bar of the Sliding Window */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 text-white shadow-xs">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Latest Higher Study & Scholarship News
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 animate-pulse">
                <Radio className="w-2.5 h-2.5 text-red-600" />
                Live Feed • Newest First
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Freshly collected circulars, intake dates, and funding calls from official authorities worldwide.
            </p>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous news"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 shadow-2xs transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next news"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 shadow-2xs transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sliding Window Horizontal Track */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {newsList.map((news, index) => {
          const isSeen = seenNewsIds.includes(news.id);

          return (
            <div
              key={news.id}
              className={`min-w-[280px] sm:min-w-[340px] max-w-[340px] snap-start shrink-0 rounded-xl bg-white border p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative ${
                news.isUrgent 
                  ? 'border-red-200 ring-1 ring-red-100' 
                  : 'border-slate-200/90'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <span className="text-base">{news.countryFlag}</span>
                    <span className="truncate max-w-[130px]">{news.authorityShortCode}</span>
                  </span>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    news.isUrgent 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {news.category}
                  </span>
                </div>

                {/* News Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5 line-clamp-2 hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              {/* Card Footer: Timestamp & Official Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {news.publishedAt}
                </span>

                <a
                  href={news.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markNewsAsSeen(news.id)}
                  className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 text-xs transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

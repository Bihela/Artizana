import React, { useState, useEffect, useRef } from 'react';

interface CarouselProps {
    images: string[];
    autoPlay?: boolean;
    interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    images,
    autoPlay = false,
    interval = 5000,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Handle auto-play
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const timer = setInterval(() => {
            scrollToIndex((activeIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, activeIndex, images.length]);

    const scrollToIndex = (index: number) => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: index * width,
                behavior: 'smooth',
            });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const index = Math.round(scrollLeft / width);
            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        }
    };

    const nextSlide = () => {
        scrollToIndex((activeIndex + 1) % images.length);
    };

    const prevSlide = () => {
        scrollToIndex((activeIndex - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No Images Available</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full group">
            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                onScroll={handleScroll}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 snap-center relative"
                    >
                        <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous Slide"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next Slide"
                    >
                        &#10095;
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === activeIndex ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;

import React from 'react';

const heroImages = [
    '/images/hero-mask.png',    // AI: Traditional Sri Lankan wooden mask carving
    '/images/hero-pottery.png', // AI: Artisan pottery wheel
    '/images/hero-batik.png'    // AI: Intricate Batik pattern
];

const HeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[500px] bg-gray-900 text-white overflow-hidden">
            {/* Background Image Slider */}
            {heroImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-60' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: `url('${image}')`
                    }}
                />
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-start p-12 max-w-4xl">
                <h1 className="text-5xl font-bold mb-4 leading-tight">
                    Authentic Craftsmanship, <br />
                    Timeless Treasures
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-xl">
                    Discover unique, handcrafted goods from artisans around the world.
                </p>

                <div className="flex gap-4">
                    {/* Placeholder buttons if needed */}
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-12 flex space-x-3">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-white scale-125'
                            : 'bg-gray-400 hover:bg-gray-300'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;

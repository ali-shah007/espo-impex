'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isManualSwipe, setIsManualSwipe] = useState<boolean>(false);
  const [autoSlide, setAutoSlide] = useState<boolean>(true);

  // Array of image paths
  const images: string[] = [
    '/images/SPORTSWEAR.webp',
    '/images/Boxing.jpg',
    '/images/martial.jpg',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoSlide) {
      // Auto-slide functionality
      interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [autoSlide, images.length]);

  // Handle swipe
  const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
    setIsManualSwipe(true); // Indicate that the user is swiping manually
    setAutoSlide(false); // Pause auto-sliding

    if (direction === 'LEFT') {
      setCurrentImage((currentImage + 1) % images.length);
    } else if (direction === 'RIGHT') {
      setCurrentImage((currentImage - 1 + images.length) % images.length);
    }

    // Resume auto-slide after 5 seconds
    setTimeout(() => {
      setIsManualSwipe(false);
      setAutoSlide(true);
    }, 5000);
  };

  // Swipeable handlers for mobile and mouse swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('LEFT'),
    onSwipedRight: () => handleSwipe('RIGHT'),
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enables mouse swipe as well
  });

  // Handle navigation dot click
  const handleDotClick = (index: number) => {
    setCurrentImage(index);
    setAutoSlide(false); // Pause auto-slide on manual dot click
    setTimeout(() => setAutoSlide(true), 5000); // Resume auto-slide after 5 seconds
  };

  return (
    <div
      className="relative w-full h-auto overflow-hidden cursor-pointer"
      {...swipeHandlers} // Add swipe handlers to the container
    >
      {/* Slideshow */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full lg:h-[70vh] md:h-[500px] h-[280px] flex-shrink-0 relative">
            <Image
              src={image}
              alt={`Espo Impex Product ${index}`}
              fill
              style={{ objectFit: 'cover' }} // Style for object-fit
              priority={index === currentImage} // Prioritize the current image for loading
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-0"></div>

      {/* Text and CTA */}
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Espo Impex</h1>
        <p className="text-lg md:text-xl mb-6">
          Premium Exporter of Sportswear, Activewear, and Apparel.
        </p>
        <p className="text-lg mb-6">Enjoy up to 30% off on selected products!</p>
        <a
          href="#products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors"
        >
          Shop Now
        </a>
      </div> */}

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentImage === index ? 'bg-red-600' : 'bg-gray-500'
            }`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

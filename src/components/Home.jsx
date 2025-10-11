// HomeSection.js
import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

 function HomeSection() {
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  // Preload images function with error handling
  const preloadImage = useCallback((src) => {
    if (!preloadedImages.has(src)) {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
      };
      img.src = src;
    }
  }, [preloadedImages]);

  // Preload all carousel images on component mount
  useEffect(() => {
    const imageSources = ['/assets/bg-1.webp', '/assets/bg-2.webp', '/assets/bg-3.webp'];
    imageSources.forEach(src => preloadImage(src));
  }, [preloadImage]);
  

  return (
    <section id="home" className="container-fluid p-0">
      {/* ✅ Fullscreen Hero Section with Carousel */}
      <div
        id="bankingCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        onMouseEnter={() => {
          // Preload next images on hover for smoother transitions
          preloadImage('/assets/bg-2.webp');
          preloadImage('/assets/bg-3.webp');
        }}
      >
        <div className="carousel-inner">
          {/* First Slide - Preloaded and high priority */}
          <div className="carousel-item active">
            <img
              src="/assets/bg-1.webp"
              className="d-block w-100"
              alt="Banking 1"
              style={{ height: "100vh", objectFit: "cover" }}
              width="1920"
              height="1080"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                console.warn('Failed to load bg-1.webp');
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Lazy-loaded Slide 2 */}
          <div className="carousel-item">
            <img
              src="/assets/bg-2.webp"
              className="d-block w-100"
              alt="Banking 2"
              style={{ height: "100vh", objectFit: "cover" }}
              width="1920"
              height="1080"
              loading="lazy"
              onError={(e) => {
                console.warn('Failed to load bg-2.webp');
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Lazy-loaded Slide 3 */}
          <div className="carousel-item">
            <img
              src="/assets/bg-3.webp"
              className="d-block w-100"
              alt="Banking 3"
              style={{ height: "100vh", objectFit: "cover" }}
              width="1920"
              height="1080"
              loading="lazy"
              onError={(e) => {
                console.warn('Failed to load bg-3.webp');
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Overlay Text */}
        <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="text-h1 display-1 text-warning border ">MV ASSOCIATES</h1>
          <p className="lead display-5 text-white fw-300 mt-4 mb-4">
            Your Trusted Partner in Banking & Financial Solutions
          </p>
          <a
            href="/register"
            className="btn btn-primary fw-bold mt-3 rounded-pill shadow" 
          >
            Register Here <IoArrowForwardCircleOutline size={20} />
          </a>
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#bankingCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#bankingCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </section>
  );
}

export default HomeSection
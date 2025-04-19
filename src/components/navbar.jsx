import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaHome, FaEye } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";
import bannerVideo1 from "../videos/banner1.mp4";
import bannerVideo2 from "../videos/banner2.mp4";

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isAuthenticating } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);

  const shouldShowBanner = location.pathname === "/" || location.pathname.startsWith("/service/");

  useEffect(() => {
    let interval;
    if (shouldShowBanner) {
      const currentVideo = videoRefs.current[currentSlide];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        currentVideo.muted = true; // Required for autoplay
        currentVideo.play().catch(error => {
          console.log("Video play failed:", error);
        });
      }

      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 2); // Now only 2 videos
      }, 10000);
    }
    return () => {
      clearInterval(interval);
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
  }, [shouldShowBanner, currentSlide]);

  const handleVideoEnd = (index) => {
    if (index === currentSlide) {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Video Banner Slideshow */}
      {shouldShowBanner && (
        <div style={{
          height: "250px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
          '@media (max-width: 768px)': {
            height: "150px" 
          }
        }}>
          {[bannerVideo1, bannerVideo2].map((videoSrc, index) => (
            <video
              key={index}
              ref={el => videoRefs.current[index] = el}
              onEnded={() => handleVideoEnd(index)}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: index === currentSlide ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                zIndex: 0
              }}
              width="1080"
              height="720"
              muted
              playsInline
              preload="auto"
              controls={false}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          ))}
        </div>
      )}

      {/* Navigation Bar */}
      <nav style={{ 
        backgroundColor: "#e74c3c",
        padding: "10px 20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "sticky",
        top: shouldShowBanner ? "250px" : "0",
        '@media (max-width: 768px)': {
          top: shouldShowBanner ? "150px" : "0"
        },
        zIndex: 100
      }}>
        {/* Home Icon */}
        <Link to="/" style={{ 
          color: "white", 
          textDecoration: "none", 
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <FaHome size={24} style={{ transition: "transform 0.3s ease" }} />
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/one-eyed-review" style={{ 
            color: "white", 
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <FaEye size={20} />
          </Link>

          {!isAuthenticating && (
            user ? (
              <Link to="/profile" style={{ 
                color: "white", 
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaUser size={20} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ 
                  color: "white", 
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease"
                }}>
                  {t("login")}
                </Link>
                <Link to="/signup" style={{ 
                  color: "white", 
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transition: "background-color 0.3s ease"
                }}>
                  {t("signup")}
                </Link>
              </>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
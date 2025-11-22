import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ImageGalleryModal.css';

interface ImageGalleryModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageGalleryModal = ({ images, initialIndex = 0, isOpen, onClose }: ImageGalleryModalProps) => {
  // Initialize with initialIndex, and reset when modal opens
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens or initialIndex changes
  // Using a key prop on the component or resetting on open would be better
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="image-gallery-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="image-gallery-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              className="gallery-close-btn"
              onClick={onClose}
              aria-label="Close gallery"
            >
              <FaTimes />
            </button>

            {/* Image counter */}
            <div className="gallery-counter">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Main image */}
            <div className="gallery-image-container">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Project image ${currentIndex + 1}`}
                  className="gallery-main-image"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="gallery-nav-btn gallery-prev-btn"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="gallery-nav-btn gallery-next-btn"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageGalleryModal;

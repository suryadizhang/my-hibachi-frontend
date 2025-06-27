# Hero Video Integration Guide for About Page

## Current State
The About page is now ready for hero video integration. The hero section has been updated to support both image and video with proper fallback mechanisms.

## How to Integrate Hero Video

### 1. Add Video Files
Place your video files in the `public` folder:
```
public/
├── videos/
│   ├── hero-video.mp4
│   ├── hero-video.webm
│   └── hero-video-poster.jpg (optional poster image)
```

### 2. Update About.jsx
Replace the commented video section with your actual video:

```jsx
{/* Hero Media Section */}
<div className="hero-media-container">
  <div className="hero-media-overlay"></div>
  
  {/* Video Implementation */}
  <video
    className="hero-media hero-video"
    width="1920"
    height="800"
    autoPlay
    muted
    loop
    playsInline
    poster={heroPic} // Fallback poster image
    onError={() => {
      // Fallback to image if video fails to load
      console.warn('Video failed to load, falling back to image');
    }}
  >
    <source src="/videos/hero-video.mp4" type="video/mp4" />
    <source src="/videos/hero-video.webm" type="video/webm" />
    
    {/* Fallback image for browsers that don't support video */}
    <img
      src={heroPic}
      alt="Private hibachi chef cooking teppanyaki in Bay Area"
      className="hero-media hero-image"
      width="1920"
      height="800"
    />
  </video>
</div>
```

### 3. Video Requirements

#### Technical Specifications:
- **Format**: MP4 (H.264) and WebM for broad browser support
- **Resolution**: 1920x1080 (Full HD) recommended
- **Aspect Ratio**: 16:9
- **Duration**: 30-60 seconds for optimal user experience
- **File Size**: Keep under 10MB for fast loading
- **Frame Rate**: 30fps recommended

#### Content Guidelines:
- Show hibachi cooking in action
- Feature chef skills and entertainment
- Highlight quality ingredients
- Keep it engaging but not distracting
- No audio required (video will be muted)

#### Optimization Tips:
```bash
# Use FFmpeg to optimize video files
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac -b:a 128k -movflags +faststart hero-video.mp4
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus hero-video.webm
```

### 4. CSS Customization

The CSS is already prepared for video. You can customize:

```css
.hero-video {
  background: #000;
  position: relative;
  z-index: 0;
  
  /* Add any video-specific styles here */
  filter: brightness(0.9); /* Optional: slightly darken video */
}

/* Video-specific responsive styles */
@media (max-width: 768px) {
  .hero-video {
    /* Mobile-specific video adjustments */
  }
}
```

### 5. Accessibility Considerations

```jsx
<video
  // ... other props
  aria-label="Hibachi chef cooking demonstration video"
  title="My Hibachi chef cooking experience"
>
  {/* Always provide fallback content */}
  <track kind="descriptions" src="/videos/hero-video-descriptions.vtt" />
  <p>Your browser doesn't support video. <a href="/images/hero_pic.png">View our hibachi experience image instead</a>.</p>
</video>
```

### 6. Performance Optimization

#### Lazy Loading (Optional):
```jsx
const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

useEffect(() => {
  // Only load video after page is ready
  const timer = setTimeout(() => setShouldPlayVideo(true), 1000);
  return () => clearTimeout(timer);
}, []);

// In JSX:
{shouldPlayVideo && (
  <video /* ... video props ... */ />
)}
```

#### Preload Strategy:
```jsx
<video
  preload="metadata" // or "none" for slower connections
  // ... other props
>
```

### 7. Testing Checklist

- [ ] Video loads on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Video loads on mobile devices (iOS Safari, Android Chrome)
- [ ] Fallback image displays if video fails
- [ ] Video is muted and autoplays correctly
- [ ] Video loops seamlessly
- [ ] Page performance remains good with video
- [ ] Video doesn't interfere with content below
- [ ] Responsive design works on all screen sizes

### 8. Alternative Implementation (React State)

For more control, you can use React state:

```jsx
const [videoError, setVideoError] = useState(false);

const handleVideoError = () => {
  setVideoError(true);
  console.warn('Video failed to load, showing fallback image');
};

// In JSX:
{!videoError ? (
  <video onError={handleVideoError} /* ... */>
    {/* video sources */}
  </video>
) : (
  <img src={heroPic} /* ... fallback image props */ />
)}
```

## Benefits of Video Hero Section

1. **Enhanced Engagement**: Videos capture attention better than static images
2. **Showcase Action**: Show actual hibachi cooking and entertainment
3. **Professional Appearance**: Modern, dynamic first impression
4. **Quality Demonstration**: Visually demonstrate the premium service
5. **Mobile Optimized**: Responsive design ensures great mobile experience

## Maintenance Notes

- Regularly test video loading across different browsers and devices
- Monitor page load performance with video enabled
- Consider seasonal video content updates
- Keep video files optimized for web delivery
- Ensure video content aligns with brand messaging

The current implementation is ready for immediate video integration while maintaining excellent fallback support and performance.

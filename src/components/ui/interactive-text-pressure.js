import React, { useEffect, useRef, useState } from 'react';

const TextPressure = ({
    text = "I'm Pratik",
    fontFamily = 'Nohemi',
    fontUrl = '/Nohemi-VF.ttf',
    width = true,
    weight = true,
    italic = false,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = '#000000',
    strokeColor = '#FF0000',
    strokeWidth = 2,
    className = '',
}) => {
    
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const spansRef = useRef([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = text.split('');

    const dist = (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {

        const handleMouseMove = (e) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        const handleTouchMove = (e) => {
            const t = e.touches[0];
            cursorRef.current.x = t.clientX;
            cursorRef.current.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [fontFamily]);

    const setSize = () => {
        if (!containerRef.current || !titleRef.current) return;

        const { height: containerH } = containerRef.current.getBoundingClientRect();

        setScaleY(1);
        setLineHeight(1);

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                setLineHeight(yRatio);
            }
        });
    };

    useEffect(() => {
        setSize();
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [scale, text]);

    useEffect(() => {

        let rafId;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2;

                spansRef.current.forEach((span, index) => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2,
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const getAttr = (distance, minVal, maxVal) => {
                        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                        return Math.max(minVal, val + minVal);
                    };

                    // Nohemi variable font axes - smooth decimal interpolation
                    const wdth = width ? getAttr(d, 75, 125) : 100; // Width: 75-125% (smooth)
                    const wght = weight ? getAttr(d, 300, 900) : 300; // Weight: 400-900 (smooth)
                    const italVal = italic ? getAttr(d, 0, 1) : 0; // Italic: 0-1 (smooth)
                    const alphaVal = alpha ? getAttr(d, 0, 1) : 1; // Alpha: 0-1 (smooth)


                    // Apply smooth transitions
                    span.style.transition = 'all 0.1s ease-out';
                    span.style.opacity = alphaVal.toString();
                    
                    // Use ONLY fontVariationSettings for smooth weight control
                    const variationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
                    span.style.fontVariationSettings = variationSettings;
                    
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha, chars.length]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent"
        >
            <style>{`
            @font-face {
              font-family: '${fontFamily}';
              src: url('${fontUrl}') format('truetype');
              font-weight: 100 900;
              font-stretch: 75% 125%;
              font-style: normal;
            }
            
            /* Debug: Add fallback font to see if Nohemi loads */
            .text-pressure-title {
              font-family: '${fontFamily}', 'Arial', sans-serif !important;
              white-space: nowrap !important;
              font-size: clamp(3rem, 2.5rem + 8vw, 12rem) !important;
              line-height: 1 !important;
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              display: block !important;
              font-weight: 500 !important;
              letter-spacing: -0.02em !important;
              color: #000000 !important;
              vertical-align: baseline !important;
            }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>

            <h1
                ref={titleRef}
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''
                    } ${stroke ? 'stroke' : ''} uppercase text-center`}
                style={{
                    fontFamily,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    color: stroke ? undefined : textColor,
                    fontVariationSettings: "'wght' 400, 'wdth' 100, 'ital' 0", // Base variable font settings
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => { spansRef.current[i] = el; }}
                        data-char={char}
                        className="inline-block"
                        style={{ whiteSpace: 'pre' }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export { TextPressure };
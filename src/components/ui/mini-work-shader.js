import React, { useRef, useEffect } from 'react';

const MiniWorkShader = ({ isActive, color = 'purple' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        console.warn('WebGL not supported');
        return;
      }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader with the provided effect
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec3 u_color;
      
      #define SPIN_ROTATION -2.0
      #define SPIN_SPEED 7.0
      #define OFFSET vec2(0.0)
      #define COLOUR_1 vec4(0.871, 0.267, 0.231, 1.0)
      #define COLOUR_2 vec4(0.0, 0.42, 0.706, 1.0)
      #define COLOUR_3 vec4(0.086, 0.137, 0.145, 1.0)
      #define CONTRAST 3.5
      #define LIGTHING 0.4
      #define SPIN_AMOUNT 0.25
      #define PIXEL_FILTER 745.0
      #define SPIN_EASE 1.0
      #define PI 3.14159265359
      #define IS_ROTATE false

      vec4 effect(vec2 screenSize, vec2 screen_coords) {
        float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
        vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
        float uv_len = length(uv);
        
        float speed = (SPIN_ROTATION*SPIN_EASE*0.2);
        if(IS_ROTATE){
           speed = iTime * speed;
        }
        speed += 302.2;
        float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE*20.*(1.*SPIN_AMOUNT*uv_len + (1. - 1.*SPIN_AMOUNT));
        vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
        uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);
        
        uv *= 30.;
        speed = iTime*(SPIN_SPEED);
        vec2 uv2 = vec2(uv.x+uv.y);
        
        for(int i=0; i < 5; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
          uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
        }
        
        float contrast_mod = (0.25*CONTRAST + 0.5*SPIN_AMOUNT + 1.2);
        float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
        float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
        float c2p = max(0.,1. - contrast_mod*abs(paint_res));
        float c3p = 1. - min(1., c1p + c2p);
        float light = (LIGTHING - 0.2)*max(c1p*5. - 4., 0.) + LIGTHING*max(c2p*5. - 4., 0.);
        return (0.3/CONTRAST)*COLOUR_1 + (1. - 0.3/CONTRAST)*(COLOUR_1*c1p + COLOUR_2*c2p + vec4(c3p*COLOUR_3.rgb, c3p*COLOUR_1.a)) + light;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec4 color = effect(iResolution.xy, uv * iResolution.xy);
        
        // Apply the project color tint
        vec3 tintColor = u_color;
        color.rgb = mix(color.rgb, tintColor, 0.3);
        
        gl_FragColor = color;
      }
    `;

    // Create shader program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Set up geometry
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    // Set up color mapping
      const colorMap = {
        purple: [0.902, 0.902, 0.902], // #E6E6E6
        orange: [0.463, 0.886, 0.894], // #76E2E4
        teal: [0.922, 0.863, 0.788],   // #EBDCC9
        yellow: [0.004, 0.200, 0.004]  // #013301
      };

      let startTime = Date.now();

      const animate = () => {
        if (!isActive) return;

        const currentTime = (Date.now() - startTime) / 1000;

        gl.useProgram(program);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, currentTime);
        
        const projectColor = colorMap[color] || colorMap.purple;
        if (projectColor && projectColor.length === 3) {
          gl.uniform3f(colorLocation, projectColor[0], projectColor[1], projectColor[2]);
        }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      console.error('Error setting up MiniWorkShader:', error);
    }
  }, [isActive, color]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default MiniWorkShader;

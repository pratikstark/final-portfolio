import React, { useEffect, useRef } from 'react';

const WorkShader = ({ color = 'red' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader source with the provided shader code
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color;

      float colormap_red(float x) {
        if (x < 0.0) {
          return 54.0 / 255.0;
        } else if (x < 20049.0 / 82979.0) {
          return (829.79 * x + 54.51) / 255.0;
        } else {
          return 1.0;
        }
      }

      float colormap_green(float x) {
        if (x < 20049.0 / 82979.0) {
          return 0.0;
        } else if (x < 327013.0 / 810990.0) {
          return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
        } else if (x <= 1.0) {
          return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
        } else {
          return 1.0;
        }
      }

      float colormap_blue(float x) {
        if (x < 0.0) {
          return 54.0 / 255.0;
        } else if (x < 7249.0 / 82979.0) {
          return (829.79 * x + 54.51) / 255.0;
        } else if (x < 20049.0 / 82979.0) {
          return 127.0 / 255.0;
        } else if (x < 327013.0 / 810990.0) {
          return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
        } else {
          return 1.0;
        }
      }

      vec4 colormap(float x) {
        return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
      }

      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);

        float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
      }

      const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

      float fbm( vec2 p )
      {
        float f = 0.0;

        f += 0.500000*noise( p + u_time  ); p = mtx*p*2.02;
        f += 0.031250*noise( p ); p = mtx*p*2.01;
        f += 0.250000*noise( p ); p = mtx*p*2.03;
        f += 0.125000*noise( p ); p = mtx*p*2.01;
        f += 0.062500*noise( p ); p = mtx*p*2.04;
        f += 0.015625*noise( p + sin(u_time) );

        return f/0.96875;
      }

      float pattern( in vec2 p )
      {
        return fbm( p + fbm( p + fbm( p ) ) );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.x;
        float shade = pattern(uv);
        vec4 baseColor = colormap(shade);
        
        // Apply color tinting based on the color prop
        vec3 colorTint = u_color;
        vec3 finalColor = baseColor.rgb * colorTint;
        
        gl_FragColor = vec4(finalColor, baseColor.a * 0.8); // Slightly transparent
      }
    `;

    // Create shader program
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

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

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    // Color mapping
    const colorMap = {
      red: [1.0, 0.2, 0.2],
      green: [0.2, 1.0, 0.2],
      blue: [0.2, 0.2, 1.0]
    };

    const currentColor = colorMap[color] || colorMap.red;

    function render(time) {
      // Resize canvas to match display size
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.useProgram(program);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001); // Convert to seconds
      gl.uniform3f(colorLocation, currentColor[0], currentColor[1], currentColor[2]);

      // Set up geometry
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    }

    // Start animation
    render(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color]);

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
        pointerEvents: 'none'
      }}
    />
  );
};

export default WorkShader;

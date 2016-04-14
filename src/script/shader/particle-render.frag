#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)

// ---

precision highp float;

uniform vec2 resolution;
varying vec3 vCol;
varying float vLen;
varying float vDist;

uniform sampler2D textureRaymarchDepth;

// ---

vec3 catColor( float _theta ) {
  return vec3(
    sin( _theta ),
    sin( _theta + 2.0 ),
    sin( _theta + 4.0 )
  ) * 0.5 + 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float raymarchDepth = texture2D( textureRaymarchDepth, uv ).x;
  if ( raymarchDepth < vLen ) { discard; }
  float shape = saturate( 100.0 * ( 0.5 - length( gl_PointCoord.xy - 0.5 ) ) );
  gl_FragColor = vec4( vCol * 4.0 * vDist, shape );
}

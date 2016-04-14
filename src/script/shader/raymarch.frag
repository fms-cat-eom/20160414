#define MARCH_ITER 128
#define RAYAMP_LIMIT 0.05

// ---

#define PI 3.14159265
#define V vec2(0.,1.)
#define saturate(i) clamp(i,0.,1.)

// ---

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform bool depth;

uniform vec3 u_cameraPos;

uniform sampler2D textureRandom;

// ---

vec4 random( float _p ) {
  return texture2D( textureRandom, _p / vec2( 0.79, 0.73 ) ) * 2.0 - 1.0;
}

vec4 noise( vec2 _p ) {
  vec4 sum = V.xxxx;
  for ( int i = 1; i < 6; i ++ ) {
    float amp = pow( 2.0, -float( i ) );
    sum += texture2D( textureRandom, _p / amp ) * amp;
  }
  return sum;
}

mat2 rotate2D( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

vec3 rotateEuler( vec3 _p, vec3 _r ) {
  vec3 p = _p;
  p.yz = rotate2D( _r.x ) * p.yz;
  p.zx = rotate2D( _r.y ) * p.zx;
  p.xy = rotate2D( _r.z ) * p.xy;
  return p;
}

float smin( float _a, float _b, float _k ) {
  float h = clamp( 0.5 + 0.5 * ( _b - _a ) / _k, 0.0, 1.0 );
  return mix( _b, _a, h ) - _k * h * ( 1.0 - h );
}

// ---

struct Camera {
  vec3 pos;
  vec3 dir;
  vec3 sid;
  vec3 top;
};

struct Ray {
  vec3 dir;
  vec3 ori;
  bool inside;
};

struct Map {
  float dist;
  vec3 col;
};

struct March {
  Ray ray;
  Map map;
  float len;
  vec3 pos;
};

// ---

Ray ray;
vec3 color;
vec3 amp;

// ---

Camera camInit( in vec3 _pos, in vec3 _tar ) {
  Camera cam;
  cam.pos = _pos;
  cam.dir = normalize( _tar - _pos );
  cam.sid = normalize( cross( cam.dir, V.xyx ) );
  cam.top = normalize( cross( cam.sid, cam.dir ) );

  return cam;
}

Map distFunc( in vec3 _p );
Ray rayInit( in vec3 _ori, in vec3 _dir ) {
  Ray ray;
  ray.dir = _dir;
  ray.ori = _ori;
  ray.inside = distFunc( ray.ori ).dist < 0.0;
  return ray;
}

Ray rayFromCam( in vec2 _p, in Camera _cam ) {
  vec3 dir = normalize( _p.x * _cam.sid + _p.y * _cam.top + _cam.dir );
  return rayInit( _cam.pos, dir );
}

Map mapInit( in float _dist ) {
  Map map;
  map.dist = _dist;
  map.col = V.xxx;
  return map;
}

March marchInit( in Ray _ray ) {
  March march;
  march.ray = _ray;
  march.len = 0.01;
  march.pos = ray.ori + ray.dir * march.len;
  return march;
}

// ---

float box( in vec3 _pos, in vec3 _size ) {
  vec3 d = abs( _pos ) - _size;
  return min( max( d.x, max( d.y, d.z ) ), 0.0 ) + length( max( d, 0.0 ) );
}

vec3 ifs( vec3 _p, vec3 _rot, vec3 _shift, int _iter ) {
  vec3 p = _p;

  for ( int i = 0; i < 20; i ++ ) {
    if ( _iter <= i ) { break; }

    float intensity = pow( 2.0, -float( i ) );

    p = rotateEuler( p, _rot );

    p = abs( p ) - _shift * intensity;

    if ( p.x < p.y ) { p.xy = p.yx; }
		if ( p.x < p.z ) { p.xz = p.zx; }
		if ( p.y < p.z ) { p.yz = p.zy; }
  }

  return p;
}

Map distFunc( in vec3 _p, in float _time ) {
  Map map = mapInit( 1E9 );

  vec3 p = _p;
  float distSphere = 1E3;

  for ( int i = 0; i < 6; i ++ ) {
    vec3 translate = vec3(
      sin( 3.0 + _time * mod( float( i + 3 ) * 3.0, 4.0 ) * PI * 2.0 ),
      sin( 1.0 + _time * mod( float( i + 1 ) * 3.0, 5.0 ) * PI * 2.0 ),
      sin( 5.0 + _time * mod( float( i + 1 ) * 4.0, 3.0 ) * PI * 2.0 )
    ) * 0.7;
    p = rotateEuler( _p, vec3( float( i ) * 1.4 ) );
    p = p - translate;
    distSphere = smin( distSphere, length( p ) - 0.7, 0.3 );
  }

  if ( distSphere < map.dist ) {
    map = mapInit( distSphere );
    map.col = vec3( 0.78, 0.16, 0.32 ) * 4.0;
  }

  return map;
}

Map distFunc( in vec3 _p ) {
  return distFunc( _p, time );
}

vec3 normalFunc( in vec3 _p, in float _d ) {
  vec2 d = V * _d;
  return normalize( vec3(
    distFunc( _p + d.yxx ).dist - distFunc( _p - d.yxx ).dist,
    distFunc( _p + d.xyx ).dist - distFunc( _p - d.xyx ).dist,
    distFunc( _p + d.xxy ).dist - distFunc( _p - d.xxy ).dist
  ) );
}

// ---

March march( in Ray _ray ) {
  March march = marchInit( _ray );

  for ( int iMarch = 0; iMarch < MARCH_ITER; iMarch ++ ) {
    Map map = distFunc( march.pos );
    map.dist *= ( ray.inside ? -1.0 : 1.0 ) * 0.8;

    march.map = map;
    march.len += map.dist;
    march.pos = ray.ori + ray.dir * march.len;

    if ( 1E3 < march.len || map.dist < 1E-4 ) { break; }
  }

  return march;
}

// ---

vec3 backgroundColor( in vec3 _dir ) {
  return V.xxx;
}

// ---

void shade( in March _march ) {
  March march = _march;

  float decay = exp( -march.len * 1E-1 );
  vec3 fogColor = backgroundColor( march.ray.dir );

  color += fogColor * ( 1.0 - decay ) * amp;
  amp *= decay;

  if ( march.map.dist < 1E-2 ) {
    vec3 normal = normalFunc( march.pos, march.len * 1E-5 );
    float dif = 0.5 + 0.5 * saturate( dot( march.ray.dir, normal ) * ( march.ray.inside ? 1.0 : -1.0 ) );

    color += amp * dif * march.map.col;
    amp *= 0.0;
    ray.ori = march.pos;
    ray.dir = reflect( ray.dir, normal );
  } else {
    amp *= 0.0;
  }
}

// ---

void depthShade( in March _march ) {
  March march = _march;

  color = V.yyy * march.len;
  amp *= 0.0;
}

// ---

void main() {
  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.x;

  Camera cam = camInit( u_cameraPos, V.xxx );
  ray = rayFromCam( p, cam );
  color = V.xxx;
  amp = V.yyy;

  for ( int iRef = 0; iRef < 6; iRef ++ ) {
    March march = march( ray );
    if ( depth ) {
      depthShade( march );
    } else {
      shade( march );
    }

    if ( length( amp ) < 0.05 ) { break; }
  }

  gl_FragColor = vec4( color, 1.0 );
}

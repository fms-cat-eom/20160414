(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/glcat.js":[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

(function () {

	'use strict';

	var GLCat = function () {
		function GLCat(_gl) {
			_classCallCheck(this, GLCat);

			this.gl = _gl;
			var it = this;
			var gl = it.gl;

			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			gl.getExtension('OES_texture_float');
			gl.getExtension('OES_float_linear');
			gl.getExtension('OES_half_float_linear');

			it.program = null;
		}

		_createClass(GLCat, [{
			key: 'createProgram',
			value: function createProgram(_vert, _frag, _onError) {

				var it = this;
				var gl = it.gl;

				var error = void 0;
				if (typeof _onError === 'function') {
					error = _onError;
				} else {
					error = function error(_str) {
						console.error(_str);
					};
				}

				var vert = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vert, _vert);
				gl.compileShader(vert);
				if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
					error(gl.getShaderInfoLog(vert));
					return null;
				}

				var frag = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(frag, _frag);
				gl.compileShader(frag);
				if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
					error(gl.getShaderInfoLog(frag));
					return null;
				}

				var program = gl.createProgram();
				gl.attachShader(program, vert);
				gl.attachShader(program, frag);
				gl.linkProgram(program);
				if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
					program.locations = {};
					return program;
				} else {
					error(gl.getProgramInfoLog(program));
					return null;
				}
			}
		}, {
			key: 'useProgram',
			value: function useProgram(_program) {

				var it = this;
				var gl = it.gl;

				gl.useProgram(_program);
				it.program = _program;
			}
		}, {
			key: 'createVertexbuffer',
			value: function createVertexbuffer(_array) {

				var it = this;
				var gl = it.gl;

				var buffer = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);

				buffer.length = _array.length;
				return buffer;
			}
		}, {
			key: 'createIndexbuffer',
			value: function createIndexbuffer(_array) {

				var it = this;
				var gl = it.gl;

				var buffer = gl.createBuffer();

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

				buffer.length = _array.length;
				return buffer;
			}
		}, {
			key: 'attribute',
			value: function attribute(_name, _buffer, _stride) {

				var it = this;
				var gl = it.gl;

				var location = void 0;
				if (it.program.locations[_name]) {
					location = it.program.locations[_name];
				} else {
					location = gl.getAttribLocation(it.program, _name);
					it.program.locations[_name] = location;
				}

				gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}
		}, {
			key: 'getUniformLocation',
			value: function getUniformLocation(_name) {

				var it = this;
				var gl = it.gl;

				var location = void 0;

				if (it.program.locations[_name]) {
					location = it.program.locations[_name];
				} else {
					location = gl.getUniformLocation(it.program, _name);
					it.program.locations[_name] = location;
				}

				return location;
			}
		}, {
			key: 'uniform1i',
			value: function uniform1i(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform1i(location, _value);
			}
		}, {
			key: 'uniform1f',
			value: function uniform1f(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform1f(location, _value);
			}
		}, {
			key: 'uniform2fv',
			value: function uniform2fv(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform2fv(location, _value);
			}
		}, {
			key: 'uniform3fv',
			value: function uniform3fv(_name, _value) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.uniform3fv(location, _value);
			}
		}, {
			key: 'uniformCubemap',
			value: function uniformCubemap(_name, _texture, _number) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.activeTexture(gl.TEXTURE0 + _number);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
				gl.uniform1i(location, _number);
			}
		}, {
			key: 'uniformTexture',
			value: function uniformTexture(_name, _texture, _number) {

				var it = this;
				var gl = it.gl;

				var location = it.getUniformLocation(_name);
				gl.activeTexture(gl.TEXTURE0 + _number);
				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.uniform1i(location, _number);
			}
		}, {
			key: 'createTexture',
			value: function createTexture() {

				var it = this;
				var gl = it.gl;

				var texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_2D, null);

				return texture;
			}
		}, {
			key: 'textureFilter',
			value: function textureFilter(_texture, _filter) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'textureWrap',
			value: function textureWrap(_texture, _wrap) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTexture',
			value: function setTexture(_texture, _image) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTextureFromArray',
			value: function setTextureFromArray(_texture, _width, _height, _array) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'setTextureFromFloatArray',
			value: function setTextureFromFloatArray(_texture, _width, _height, _array) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'copyTexture',
			value: function copyTexture(_texture, _width, _height) {

				var it = this;
				var gl = it.gl;

				gl.bindTexture(gl.TEXTURE_2D, _texture);
				gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, {
			key: 'createCubemap',
			value: function createCubemap(_arrayOfImage) {

				var it = this;
				var gl = it.gl;

				// order : X+, X-, Y+, Y-, Z+, Z-
				var texture = gl.createTexture();

				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				for (var i = 0; i < 6; i++) {
					gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
				}
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

				return texture;
			}
		}, {
			key: 'createFramebuffer',
			value: function createFramebuffer(_width, _height) {

				var it = this;
				var gl = it.gl;

				var framebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

				framebuffer.depth = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

				framebuffer.texture = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				return framebuffer;
			}
		}, {
			key: 'createFloatFramebuffer',
			value: function createFloatFramebuffer(_width, _height) {

				var it = this;
				var gl = it.gl;

				var framebuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

				framebuffer.depth = gl.createRenderbuffer();
				gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
				gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

				framebuffer.texture = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				return framebuffer;
			}
		}, {
			key: 'clear',
			value: function clear(_r, _g, _b, _a, _d) {

				var it = this;
				var gl = it.gl;

				var r = _r || 0.0;
				var g = _g || 0.0;
				var b = _b || 0.0;
				var a = typeof _a === 'number' ? _a : 1.0;
				var d = typeof _d === 'number' ? _d : 1.0;

				gl.clearColor(r, g, b, a);
				gl.clearDepth(d);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			}
		}]);

		return GLCat;
	}();

	if (typeof window !== 'undefined') {
		window.GLCat = GLCat;
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = GLCat;
	}
})();

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/main.js":[function(require,module,exports){
'use strict';

(function () {

  'use strict';

  var xorshift = require('./xorshift');
  
  var GLCat = require('./glcat');

  // ---

  var clamp = function clamp(_value, _min, _max) {
    return Math.min(Math.max(_value, _min), _max);
  };

  var saturate = function saturate(_value) {
    return clamp(_value, 0.0, 1.0);
  };

  // ---

  var width = canvas.width = 300;
  var height = canvas.height = 300;
  var gl = canvas.getContext('webgl');
  var glCat = new GLCat(gl);
  gl.disable(gl.DEPTH_TEST);

  var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);

  var vertQuad = "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n";
  var fragReturn = "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( texture, uv );\n}\n";
  var programReturn = glCat.createProgram(vertQuad, fragReturn);
  var framebufferRender = glCat.createFloatFramebuffer(width, height);

  var framebufferRaymarchDepth = glCat.createFloatFramebuffer(width, height);
  var fragRaymarch = "#define MARCH_ITER 128\n#define RAYAMP_LIMIT 0.05\n\n// ---\n\n#define PI 3.14159265\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\nuniform bool depth;\n\nuniform vec3 u_cameraPos;\n\nuniform sampler2D textureRandom;\n\n// ---\n\nvec4 random( float _p ) {\n  return texture2D( textureRandom, _p / vec2( 0.79, 0.73 ) ) * 2.0 - 1.0;\n}\n\nvec4 noise( vec2 _p ) {\n  vec4 sum = V.xxxx;\n  for ( int i = 1; i < 6; i ++ ) {\n    float amp = pow( 2.0, -float( i ) );\n    sum += texture2D( textureRandom, _p / amp ) * amp;\n  }\n  return sum;\n}\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec3 rotateEuler( vec3 _p, vec3 _r ) {\n  vec3 p = _p;\n  p.yz = rotate2D( _r.x ) * p.yz;\n  p.zx = rotate2D( _r.y ) * p.zx;\n  p.xy = rotate2D( _r.z ) * p.xy;\n  return p;\n}\n\nfloat smin( float _a, float _b, float _k ) {\n  float h = clamp( 0.5 + 0.5 * ( _b - _a ) / _k, 0.0, 1.0 );\n  return mix( _b, _a, h ) - _k * h * ( 1.0 - h );\n}\n\n// ---\n\nstruct Camera {\n  vec3 pos;\n  vec3 dir;\n  vec3 sid;\n  vec3 top;\n};\n\nstruct Ray {\n  vec3 dir;\n  vec3 ori;\n  bool inside;\n};\n\nstruct Map {\n  float dist;\n  vec3 col;\n};\n\nstruct March {\n  Ray ray;\n  Map map;\n  float len;\n  vec3 pos;\n};\n\n// ---\n\nRay ray;\nvec3 color;\nvec3 amp;\n\n// ---\n\nCamera camInit( in vec3 _pos, in vec3 _tar ) {\n  Camera cam;\n  cam.pos = _pos;\n  cam.dir = normalize( _tar - _pos );\n  cam.sid = normalize( cross( cam.dir, V.xyx ) );\n  cam.top = normalize( cross( cam.sid, cam.dir ) );\n\n  return cam;\n}\n\nMap distFunc( in vec3 _p );\nRay rayInit( in vec3 _ori, in vec3 _dir ) {\n  Ray ray;\n  ray.dir = _dir;\n  ray.ori = _ori;\n  ray.inside = distFunc( ray.ori ).dist < 0.0;\n  return ray;\n}\n\nRay rayFromCam( in vec2 _p, in Camera _cam ) {\n  vec3 dir = normalize( _p.x * _cam.sid + _p.y * _cam.top + _cam.dir );\n  return rayInit( _cam.pos, dir );\n}\n\nMap mapInit( in float _dist ) {\n  Map map;\n  map.dist = _dist;\n  map.col = V.xxx;\n  return map;\n}\n\nMarch marchInit( in Ray _ray ) {\n  March march;\n  march.ray = _ray;\n  march.len = 0.01;\n  march.pos = ray.ori + ray.dir * march.len;\n  return march;\n}\n\n// ---\n\nfloat box( in vec3 _pos, in vec3 _size ) {\n  vec3 d = abs( _pos ) - _size;\n  return min( max( d.x, max( d.y, d.z ) ), 0.0 ) + length( max( d, 0.0 ) );\n}\n\nvec3 ifs( vec3 _p, vec3 _rot, vec3 _shift, int _iter ) {\n  vec3 p = _p;\n\n  for ( int i = 0; i < 20; i ++ ) {\n    if ( _iter <= i ) { break; }\n\n    float intensity = pow( 2.0, -float( i ) );\n\n    p = rotateEuler( p, _rot );\n\n    p = abs( p ) - _shift * intensity;\n\n    if ( p.x < p.y ) { p.xy = p.yx; }\n\t\tif ( p.x < p.z ) { p.xz = p.zx; }\n\t\tif ( p.y < p.z ) { p.yz = p.zy; }\n  }\n\n  return p;\n}\n\nMap distFunc( in vec3 _p, in float _time ) {\n  Map map = mapInit( 1E9 );\n\n  vec3 p = _p;\n  float distSphere = 1E3;\n\n  for ( int i = 0; i < 6; i ++ ) {\n    vec3 translate = vec3(\n      sin( 3.0 + _time * mod( float( i + 3 ) * 3.0, 4.0 ) * PI * 2.0 ),\n      sin( 1.0 + _time * mod( float( i + 1 ) * 3.0, 5.0 ) * PI * 2.0 ),\n      sin( 5.0 + _time * mod( float( i + 1 ) * 4.0, 3.0 ) * PI * 2.0 )\n    ) * 0.7;\n    p = rotateEuler( _p, vec3( float( i ) * 1.4 ) );\n    p = p - translate;\n    distSphere = smin( distSphere, length( p ) - 0.7, 0.3 );\n  }\n\n  if ( distSphere < map.dist ) {\n    map = mapInit( distSphere );\n    map.col = vec3( 0.78, 0.16, 0.32 ) * 4.0;\n  }\n\n  return map;\n}\n\nMap distFunc( in vec3 _p ) {\n  return distFunc( _p, time );\n}\n\nvec3 normalFunc( in vec3 _p, in float _d ) {\n  vec2 d = V * _d;\n  return normalize( vec3(\n    distFunc( _p + d.yxx ).dist - distFunc( _p - d.yxx ).dist,\n    distFunc( _p + d.xyx ).dist - distFunc( _p - d.xyx ).dist,\n    distFunc( _p + d.xxy ).dist - distFunc( _p - d.xxy ).dist\n  ) );\n}\n\n// ---\n\nMarch march( in Ray _ray ) {\n  March march = marchInit( _ray );\n\n  for ( int iMarch = 0; iMarch < MARCH_ITER; iMarch ++ ) {\n    Map map = distFunc( march.pos );\n    map.dist *= ( ray.inside ? -1.0 : 1.0 ) * 0.8;\n\n    march.map = map;\n    march.len += map.dist;\n    march.pos = ray.ori + ray.dir * march.len;\n\n    if ( 1E3 < march.len || map.dist < 1E-4 ) { break; }\n  }\n\n  return march;\n}\n\n// ---\n\nvec3 backgroundColor( in vec3 _dir ) {\n  return V.xxx;\n}\n\n// ---\n\nvoid shade( in March _march ) {\n  March march = _march;\n\n  float decay = exp( -march.len * 1E-1 );\n  vec3 fogColor = backgroundColor( march.ray.dir );\n\n  color += fogColor * ( 1.0 - decay ) * amp;\n  amp *= decay;\n\n  if ( march.map.dist < 1E-2 ) {\n    vec3 normal = normalFunc( march.pos, march.len * 1E-5 );\n    float dif = 0.5 + 0.5 * saturate( dot( march.ray.dir, normal ) * ( march.ray.inside ? 1.0 : -1.0 ) );\n\n    color += amp * dif * march.map.col;\n    amp *= 0.0;\n    ray.ori = march.pos;\n    ray.dir = reflect( ray.dir, normal );\n  } else {\n    amp *= 0.0;\n  }\n}\n\n// ---\n\nvoid depthShade( in March _march ) {\n  March march = _march;\n\n  color = V.yyy * march.len;\n  amp *= 0.0;\n}\n\n// ---\n\nvoid main() {\n  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.x;\n\n  Camera cam = camInit( u_cameraPos, V.xxx );\n  ray = rayFromCam( p, cam );\n  color = V.xxx;\n  amp = V.yyy;\n\n  for ( int iRef = 0; iRef < 6; iRef ++ ) {\n    March march = march( ray );\n    if ( depth ) {\n      depthShade( march );\n    } else {\n      shade( march );\n    }\n\n    if ( length( amp ) < 0.05 ) { break; }\n  }\n\n  gl_FragColor = vec4( color, 1.0 );\n}\n";
  var programRaymarch = glCat.createProgram(vertQuad, fragRaymarch);

  var particleCountSqrt = 256;
  var particleCount = particleCountSqrt * particleCountSqrt;
  var framebufferParticleCompute = glCat.createFloatFramebuffer(particleCountSqrt * 4.0, particleCountSqrt);
  var framebufferParticleComputeReturn = glCat.createFloatFramebuffer(particleCountSqrt * 4.0, particleCountSqrt);
  var fragParticleCompute = "#define PI 3.14159265\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particleCountSqrt;\nuniform bool frameZero;\nuniform float deltaTime;\n\nuniform sampler2D textureParticle;\nuniform sampler2D textureRandom;\n\n// ---\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec3 rotateEuler( vec3 _p, vec3 _r ) {\n  vec3 p = _p;\n  p.yz = rotate2D( _r.x ) * p.yz;\n  p.zx = rotate2D( _r.y ) * p.zx;\n  p.xy = rotate2D( _r.z ) * p.xy;\n  return p;\n}\n\nfloat smin( float _a, float _b, float _k ) {\n  float h = clamp( 0.5 + 0.5 * ( _b - _a ) / _k, 0.0, 1.0 );\n  return mix( _b, _a, h ) - _k * h * ( 1.0 - h );\n}\n\n// ---\n\nfloat box( in vec3 _pos, in vec3 _size ) {\n  vec3 d = abs( _pos ) - _size;\n  return min( max( d.x, max( d.y, d.z ) ), 0.0 ) + length( max( d, 0.0 ) );\n}\n\nvec3 ifs( vec3 _p, vec3 _rot, vec3 _shift, int _iter ) {\n  vec3 p = _p;\n\n  for ( int i = 0; i < 20; i ++ ) {\n    if ( _iter <= i ) { break; }\n\n    float intensity = pow( 2.0, -float( i ) );\n\n    p = rotateEuler( p, _rot );\n\n    p = abs( p ) - _shift * intensity;\n\n    if ( p.x < p.y ) { p.xy = p.yx; }\n\t\tif ( p.x < p.z ) { p.xz = p.zx; }\n\t\tif ( p.y < p.z ) { p.yz = p.zy; }\n  }\n\n  return p;\n}\n\nfloat distFunc( in vec3 _p, in float _time ) {\n  float dist = 1E9;\n\n  vec3 p = _p;\n  float distSphere = length( p ) - 0.5;\n\n  for ( int i = 0; i < 6; i ++ ) {\n    vec3 translate = vec3(\n      sin( 3.0 + _time * mod( float( i + 3 ) * 3.0, 4.0 ) * PI * 2.0 ),\n      sin( 1.0 + _time * mod( float( i + 1 ) * 3.0, 5.0 ) * PI * 2.0 ),\n      sin( 5.0 + _time * mod( float( i + 1 ) * 4.0, 3.0 ) * PI * 2.0 )\n    ) * 0.7;\n    p = rotateEuler( _p, vec3( float( i ) * 1.4 ) );\n    p = p - translate;\n    distSphere = smin( distSphere, length( p ) - 0.7, 0.3 );\n  }\n\n  if ( distSphere < dist ) {\n    dist = distSphere;\n  }\n\n  return dist;\n}\n\nfloat distFunc( in vec3 _p ) {\n  return distFunc( _p, time );\n}\n\nvec3 normalFunc( in vec3 _p, in float _d ) {\n  vec2 d = V * _d;\n  return normalize( vec3(\n    distFunc( _p + d.yxx ) - distFunc( _p - d.yxx ),\n    distFunc( _p + d.xyx ) - distFunc( _p - d.xyx ),\n    distFunc( _p + d.xxy ) - distFunc( _p - d.xxy )\n  ) );\n}\n\n// ---\n\nvoid main() {\n  vec2 reso = vec2( 4.0, 1.0 ) * particleCountSqrt;\n\n  float type = mod( floor( gl_FragCoord.x ), 4.0 );\n\n  vec3 pos = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 vel = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 col = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 life = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;\n\n  vec3 posI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 velI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 colI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).xyz;\n  vec3 lifeI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso ).xyz;\n\n  vec3 colDef = vec3( 0.3, 0.6, 1.0 );\n\n  if ( frameZero || 0.99 < life.x ) {\n    pos = posI;\n    pos.y = 3.0;\n    pos.zx = ( pos.zx - 0.5 ) * 1.0;\n\n    vel = ( velI - 0.5 ) * 2.0;\n\n    col = vec3( 0.78, 0.16, 0.32 );\n\n    life = lifeI;\n  }\n\n  float dist = distFunc( pos );\n  life.z = dist;\n\n  if ( dist < 0.0 ) {\n    vec3 normal = normalFunc( pos, 1E-3 );\n    pos += normal * ( -dist + 0.01 );\n    vel += normal * 1E3 * ( distFunc( pos, time ) - distFunc( pos, time - 1E-3 ) );\n    vel = vel - 1.4 * dot( vel, normal ) * normal;\n  }\n\n  vel.y -= 15.0 * deltaTime;\n  vel *= exp( -deltaTime * 2.0 );\n\n  pos += vel * deltaTime;\n\n  life.x = mod( lifeI.x - time * 1.0 + 1.0, 1.0 );\n\n  vec3 ret;\n  if ( type == 0.0 ) {\n    ret = pos;\n  } else if ( type == 1.0 ) {\n    ret = vel;\n  } else if ( type == 2.0 ) {\n    ret = col;\n  } else if ( type == 3.0 ) {\n    ret = life;\n  }\n\n  gl_FragColor = vec4( ret, 1.0 );\n}\n";
  var programParticleCompute = glCat.createProgram(vertQuad, fragParticleCompute);

  var framebufferMotionblur = glCat.createFloatFramebuffer(width, height);
  var framebufferMotionblurReturn = glCat.createFloatFramebuffer(width, height);
  var fragMotionblur = "precision highp float;\n#define GLSLIFY 1\n\nuniform bool init;\nuniform float add;\nuniform vec2 resolution;\nuniform sampler2D renderTexture;\nuniform sampler2D blurTexture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 ret = texture2D( renderTexture, uv ).xyz * add;\n  if ( !init ) {\n    ret += texture2D( blurTexture, uv ).xyz;\n  }\n  gl_FragColor = vec4( ret, 1.0 );\n}\n";
  var programMotionblur = glCat.createProgram(vertQuad, fragMotionblur);

  var vboParticle = glCat.createVertexbuffer(function () {
    var a = [];
    for (var iy = 0; iy < particleCountSqrt; iy++) {
      for (var ix = 0; ix < particleCountSqrt; ix++) {
        a.push(ix);
        a.push(iy);
      }
    }
    return a;
  }());
  var framebufferParticleRender = glCat.createFloatFramebuffer(width, height);
  var vertParticleRender = "#define GLSLIFY 1\n#define PI 3.14159265\n#define V vec2(0.,1.)\n\n// ---\n\nattribute vec2 uv;\n\nvarying vec3 vCol;\nvarying float vLen;\nvarying float vDist;\n\nuniform float time;\nuniform vec2 resolution;\nuniform float particleCountSqrt;\nuniform vec3 u_cameraPos;\n\nuniform sampler2D textureParticle;\n\n// ---\n\nmat4 lookAt( vec3 _pos, vec3 _tar, vec3 _air ) {\n  vec3 dir = normalize( _tar - _pos );\n  vec3 sid = normalize( cross( dir, _air ) );\n  vec3 top = normalize( cross( sid, dir ) );\n  return mat4(\n    sid.x, top.x, dir.x, 0.0,\n    sid.y, top.y, dir.y, 0.0,\n    sid.z, top.z, dir.z, 0.0,\n    - sid.x * _pos.x - sid.y * _pos.y - sid.z * _pos.z,\n    - top.x * _pos.x - top.y * _pos.y - top.z * _pos.z,\n    - dir.x * _pos.x - dir.y * _pos.y - dir.z * _pos.z,\n    1.0\n  );\n}\n\nmat4 perspective( float _fov, float _aspect, float _near, float _far ) {\n  float p = 1.0 / tan( _fov * PI / 180.0 / 2.0 );\n  float d = _far / ( _far - _near );\n  return mat4(\n    p / _aspect, 0.0, 0.0, 0.0,\n    0.0, p, 0.0, 0.0,\n    0.0, 0.0, d, 1.0,\n    0.0, 0.0, -_near * d, 0.0\n  );\n}\n\nmat2 rotate( float _theta ) {\n  return mat2( cos( _theta ), sin( _theta ), -sin( _theta ), cos( _theta ) );\n}\n\n// ---\n\nvoid main() {\n  vec3 pos = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 0.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 vel = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 1.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 col = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 2.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n  vec3 life = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 3.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt ).xyz;\n\n  mat4 matP = perspective( 90.0, resolution.x / resolution.y, 0.01, 100.0 );\n\n  vec3 cameraPos = u_cameraPos;\n  mat4 matV = lookAt( cameraPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) );\n\n  gl_Position = matP * matV * vec4( pos, 1.0 );\n  gl_PointSize = 5.0 * pow( life.x, 0.3 ) / gl_Position.z;\n\n  vCol = col;\n  vLen = length( cameraPos - pos );\n  vDist = exp( -life.z * 1.2 );\n}\n";
  var fragParticleRender = "#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nvarying vec3 vCol;\nvarying float vLen;\nvarying float vDist;\n\nuniform sampler2D textureRaymarchDepth;\n\n// ---\n\nvec3 catColor( float _theta ) {\n  return vec3(\n    sin( _theta ),\n    sin( _theta + 2.0 ),\n    sin( _theta + 4.0 )\n  ) * 0.5 + 0.5;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  float raymarchDepth = texture2D( textureRaymarchDepth, uv ).x;\n  if ( raymarchDepth < vLen ) { discard; }\n  float shape = saturate( 100.0 * ( 0.5 - length( gl_PointCoord.xy - 0.5 ) ) );\n  gl_FragColor = vec4( vCol * 4.0 * vDist, shape );\n}\n";
  var programParticleRender = glCat.createProgram(vertParticleRender, fragParticleRender);

  var textureRandomSize = 2048;
  var textureRandom = glCat.createTexture();
  glCat.textureWrap(textureRandom, gl.REPEAT);
  glCat.setTextureFromFloatArray(textureRandom, 2048, 2048, function () {
    var len = 2048 * 2048 * 4;
    var ret = new Float32Array(len);
    for (var i = 0; i < len; i++) {
      ret[i] = xorshift();
    }
    return ret;
  }());

  // ---

  var frame = 0;
  var frames = 160;
  var blurSample = 10;
  var time = 0.0;

  // ---

  var cameraPos = [0.0, 0.0, 0.0];
  var cameraPosUpdate = function cameraPosUpdate(_phase) {
    cameraPos = [0.0, 0.0, 3.0];
  };

  // ---

  var renderRaymarch = function renderRaymarch(_target, _depth) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programRaymarch);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform1f('time', time);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniform1i('depth', _depth);
    glCat.uniform3fv('u_cameraPos', cameraPos);

    glCat.uniformTexture('textureRandom', textureRandom, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var computeParticle = function computeParticle(_target, _deltaTime) {

    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programParticleCompute);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleComputeReturn);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform1i('frameZero', frame === 0);
    glCat.uniform1f('deltaTime', _deltaTime);

    glCat.uniformTexture('textureRandom', textureRandom, 0);
    glCat.uniformTexture('textureParticle', framebufferParticleCompute.texture, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // ---

    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform2fv('resolution', [particleCountSqrt * 4.0, particleCountSqrt]);

    glCat.uniformTexture('texture', framebufferParticleComputeReturn.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var renderParticle = function renderParticle(_compute, _raymarchDepth, _target) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programParticleRender);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);

    glCat.attribute('uv', vboParticle, 2);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniform3fv('u_cameraPos', cameraPos);

    glCat.uniformTexture('textureParticle', _compute, 0);
    glCat.uniformTexture('textureRaymarchDepth', _raymarchDepth, 1);

    gl.drawArrays(gl.POINTS, 0, particleCount);
  };

  // ---

  var render = function render(_target, _deltaTime) {

    renderRaymarch(_target, false);
    renderRaymarch(framebufferRaymarchDepth, true);
    computeParticle(framebufferParticleCompute, _deltaTime);
    renderParticle(framebufferParticleCompute.texture, framebufferRaymarchDepth.texture, _target);

    gl.flush();
  };

  // ---

  var motionblur = function motionblur(_texture, _target, _blurCount) {

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programMotionblur);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferMotionblurReturn);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform1f('add', 1.0 / blurSample);
    glCat.uniform1i('init', _blurCount === 0);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('renderTexture', _texture, 0);
    glCat.uniformTexture('blurTexture', framebufferMotionblur.texture, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // ------

    gl.viewport(0, 0, width, height);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, _target);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('texture', framebufferMotionblurReturn.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // ---

  var renderA = document.createElement('a');

  var saveFrame = function saveFrame() {
    renderA.href = canvas.toDataURL();
    renderA.download = ('0000' + frame).slice(-5) + '.png';
    renderA.click();
  };

  // ---

  var update = function update() {

    if (checkboxBlur.checked) {
      for (var i = 0; i < 10; i++) {
        time = (frame + 0.1 * i) / frames % 1.0;
        cameraPosUpdate(time * Math.PI * 2.0);
        render(framebufferRender, 1.0 / 50.0 / 10.0);
        motionblur(framebufferRender.texture, i === 9 ? null : framebufferMotionblur, i);
      }
    } else {
      time = frame / frames % 1.0;
      cameraPosUpdate(time * Math.PI * 2.0);
      render(null, 1.0 / 50.0);
    }

    if (checkboxSave.checked && frames <= frame) {
      saveFrame();
    }

    frame++;
    if (frame % frames === 0) {}

    requestAnimationFrame(update);
  };

  button.onclick = function () {
    update();
  };
})();

},{"./glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/glcat.js","./xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/xorshift.js":[function(require,module,exports){
"use strict";

(function () {

  var seed = void 0;
  var xorshift = function xorshift(_seed) {
    seed = _seed || seed || 1;
    seed = seed ^ seed << 13;
    seed = seed ^ seed >>> 17;
    seed = seed ^ seed << 5;
    return seed / Math.pow(2, 32) + 0.5;
  };

  module.exports = xorshift;
})();

},{}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/20160414/src/script/main.js"]);

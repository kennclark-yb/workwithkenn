const rgba = hex => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).concat(1);

// Final approved letterform-only treatment, copied without visual retuning.
export const logoSettings = {
  updatesPerSecond: 30, maxPixelCount: 12000,
  speed: .7, opacity: .95, frame: 17000,
  shader: '../vendor/paper/shaders/liquid-metal.js', exportName: 'liquidMetalFragmentShader',
  image: '../../assets/branding/kc-logo/kc-metal-bold.png', scale: 1,
  uniforms: {
    u_colorBack: [0, 0, 0, 0], u_colorTint: rgba('#C7D5FF'),
    u_repetition: 2, u_softness: .35, u_shiftRed: 0, u_shiftBlue: .04,
    u_distortion: .08, u_contour: .3, u_angle: 65, u_shape: 0, u_isImage: true,
  },
};

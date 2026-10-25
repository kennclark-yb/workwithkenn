const rgba = hex => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).concat(1);

// Visual choices are data; the shared lifecycle does not branch by project/variant.
// Change only this setting to 'grain-gradient' for the approved alternate.
export const BACKGROUND_MODE = 'dithering';
export const backgrounds = {
  dithering: {
    name: 'BG-A — Dithering', opacity: .075, timeScale: .17, updatesPerSecond: 24, frame: 14000,
    colors: { back: '#090A0C', front: '#4D7CFE' },
    sizing: { u_scale: .8, u_rotation: 12 },
    async load() {
      const { ditheringFragmentShader } = await import('../vendor/paper/shaders/dithering.js');
      return { fragment: ditheringFragmentShader, uniforms: {
        u_colorBack: rgba(this.colors.back), u_colorFront: rgba(this.colors.front),
        u_shape: 1, u_type: 3, u_pxSize: .75, // simplex; fine 4×4 Bayer grid
      } };
    },
  },
  'grain-gradient': {
    name: 'BG-B — Grain Gradient', opacity: .3, timeScale: .008, frame: 14000,
    colors: { back: '#090A0C', fields: ['#4D7CFE', '#21172C'] },
    resolution: { minPixelRatio: 1.5, desktopPixels: 3000000, mobilePixels: 1000000 },
    sizing: { u_scale: 1.2, u_rotation: 16, u_offsetX: .15, u_offsetY: -.1 },
    async load() {
      const [{ grainGradientFragmentShader }, { getShaderNoiseTexture }] = await Promise.all([
        import('../vendor/paper/shaders/grain-gradient.js'),
        import('../vendor/paper/get-shader-noise-texture.js'),
      ]);
      const texture = getShaderNoiseTexture();
      await texture.decode();
      return { fragment: grainGradientFragmentShader, uniforms: {
        u_colorBack: rgba(this.colors.back),
        u_colors: this.colors.fields.map(rgba), u_colorsCount: this.colors.fields.length,
        u_softness: .85, u_intensity: .3, u_noise: .025, u_shape: 4,
        u_noiseTexture: texture, // bundled data URI; no external image request
      } };
    },
  },
};

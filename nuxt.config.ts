// export default defineNuxtConfig({
//   css:[
//       'element-plus/dist/index.css',
//   ],

//   modules: ['@vant/nuxt'],
//   vant: {
//     /** Options */
//   },
// })
export default defineNuxtConfig({
  css: [
    'element-plus/dist/index.css',
  ],

  modules: ['@vant/nuxt'],
  vant: {
    /** Options */
  },

  nitro: {
    devProxy: {
      '/api0': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api0': '' },
      },
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      '/api1': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: { '^/api1': '' },
      },
      '/api3': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        pathRewrite: { '^/api3': '' },
      },
    },
  },

  build: {
    transpile: ['three/examples/jsm/loaders/GLTFLoader'],
  },
});





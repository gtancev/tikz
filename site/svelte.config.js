import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import Icons from 'unplugin-icons/vite'

export default {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: { default: true },

    files: {
      assets: `../assets`,
    },

    vite: {
      plugins: [Icons({ compiler: `svelte`, autoInstall: true })],
    },
  },
}

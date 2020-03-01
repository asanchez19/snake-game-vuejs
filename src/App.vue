<template>
  <div id="app">
    <game/>
  </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
	/**
	 * The component's registered child components.
	 *
	 * @type {Object}
	 */
	components: {
		Game,
	},

/**
 * The component's name used for debugging.
 *
 * @type {String}
 */
name: 'App',

}
</script>

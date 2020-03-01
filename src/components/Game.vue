<template>
	<div class="container">
		<div class="status-bar">SNAKE - Score {{ score }}</div>
		<div class="game">
			<table v-if="!dead">
				<tr v-for="(row, index) in grid" :key="index">
					<td v-for="(cell, index) in row" :key="index" class="grid-cell"
						:class="{ snake: cell.snake > 0, food: cell.food }">
					</td>
				</tr>
			</table>
			<div v-else>
				<button @click="reset()">Play Again?</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Grid from '../app/Grid.js'

	const UP = [-1, 0]
	const DOWN = [1, 0]
	const LEFT = [0, -1]
	const RIGHT = [0, 1]

	let keyMap = {
		"37": LEFT,
		"38": UP,
		"39": RIGHT,
		"40": DOWN
	}


	let feeding = []
	let length = 3
	let oldFood = []
	let snakePos = []
	let snakeCells = []
	let ticking = []
	let userActions = []
	export default {
		/**
		 * The component's local methods.
		 *
		 * @type {Object}
		 */
		methods: {
			/**
			 * Determine if the snake should eat.
			 *
			 * @return {void}
			 */
			eatFood() {
				if (snakePos && snakePos.food) {
					this.score++

					length++

					snakeCells.forEach(cell => cell.snake++)

					snakePos.food = false

					this.setFood()
				}
			},

			/**
			 * Finish the game.
			 *
			 * @return {void}
			 */
			gameOver() {
				this.dead = true

				clearInterval(ticking)

				clearInterval(feeding)
			},

			/**
			 * Get a random number between the given interval.
			 *
			 * @param {Number} min
			 * @param {Number} max
			 * @return {Number}
			 */
			getRandomNumber(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min)
			},


			/**
			 * Handle the user action event.
			 *
			 * @param {String} key
			 * @return {void}
			 */
			handleUserAction(key) {
				let direction = keyMap[key];

				if (!direction) {
					return
				}

				userActions.push(() => {
					if (!this.isOppositeDirection(direction, this.direction)) {
						this.direction = direction
					}
				});
			},

			/**
			 * Determine if the new direction is the opposite to the current one.
			 *
			 * @param {Array} newDirection
			 * @return {Boolean}
			 */
			isOppositeDirection(newDirection) {
				return newDirection[0] + this.direction[0] === 0 && newDirection[1] + this.direction[1] === 0
			},

			/**
			 * Move the snake to the next position.
			 *
			 * @return {void}
			 */
			moveSnake() {
				let { x, y } = snakePos

				let [xd, yd] = this.direction

				snakePos = (this.grid[x + xd] || [])[y + yd]

				if (!snakePos) {
					if (this.size > 15) {

						this.size = this.size - (this.size * 0.166)

						clearInterval(ticking)

						clearInterval(feeding)

						return this.start(this.size)
					}

					return this.gameOver()
				}


				if (snakePos.snake || !snakePos) {
					return this.gameOver();
				}

				snakeCells.forEach(cell => cell.snake--);

				snakeCells = snakeCells.filter(cell => cell.snake > 0);

				snakePos.snake = length;

				snakeCells.push(snakePos);
			},

			/**
			 * Add a piece of food into the grid.
			 *
			 * @return {void}
			 */
			setFood() {
				oldFood.food = false;

				oldFood = Grid.random(this.grid)

				oldFood.food = true;
			},

			/**
			 * Start the game.
			 *
			 * @param {Number} size
			 * @return {void}
			 */
			start(size = 60) {
				this.size = size

				let snakeSpeed = 50

				let foodSpeed = this.getRandomNumber(4000, 10000)

				this.grid = new Grid(size, (x, y) => ({
					x,
					y,
					snake: 0,
					food: false
				}))

				this.dead = false;

				userActions = [];

				ticking = setInterval(this.tick, snakeSpeed);

				snakePos = Grid.random(this.grid);

				snakePos.snake = length;

				snakeCells = [snakePos];

				feeding = setInterval(this.setFood, foodSpeed);
			},

			/**
			 * Reset all the data.
			 *
			 * @return {void}
			 */
			reset() {
				location.reload()
			},

			/**
			 * Determine the snake have to do in every tick.
			 *
			 * @return {void}
			 */
			tick() {
				let userAction = userActions.shift()

				if (userAction) {
					userAction()
				}

				this.moveSnake()

				this.eatFood()
			},
		},

		/**
		 * The component's before create lifecycle hook.
		 *
		 * @return {void}
		 */
		created() {
			this.start();

			window.addEventListener('keydown', event => this.handleUserAction(event.which))
		},
		/**
		 * Get the component's initial state.
		 *
		 * @return {Object}
		 */
		data() {
			return {
				dead: false,
				direction: UP,
				grid: null,
				score: 0,
				size: 60,
			}
		},

	/**
	 * The component's name used for debugging.
	 *
	 * @type {String}
	 */
	name: 'Game',

	}
</script>

<style>
 .container {
display: flex;
flex-flow: 1;
align-items: center;
justify-content: center;
flex-direction: column;
border: 1px solid black;
}

 .status-bar {
background-color: #91C7B1;
display: flex;
justify-content: center;
align-items: center;
font-size: 3rem;
height: 5rem;
margin-top: 1rem;
margin-bottom: 1rem;
text-align: center;
width: 100%;
 }

 .game {
background-color: rgb(169, 177, 169);
display: flex;
flex-grow: 1;
justify-content: center;
margin-bottom: 1rem;
 }

 table {
border-collapse: collapse;
 }

 .grid-cell {
margin: 0;
padding: 0;
height: 10px;
width: 10px;
background-color: #f4f4f4;
border: 1px solid white;
 }

 .food {
background-color: #e3d081;
 }

 .snake {
background-color: #54494B;
 }
</style>

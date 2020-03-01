/**
 * Grid array.
 *
 * @author Alejandro Sanchez <rasso92@gmail.com>
 */
export default class Grid extends Array {
	constructor(size, callback) {
		super()

		for(let x = 0; x < size; x++) {
			this[x] = []

			for(let y = 0; y < size; y++){
				this[x][y] = callback(x, y)
			}
		}
	}

	/**
	 * Generate a random grid position.
	 *
	 * @param {Array} grid
	 * @return {Array}
	 */
	static random(grid) {
		let x = Math.floor(Math.random() * grid.length)

		let y = Math.floor(Math.random() * grid[x].length)

		return grid[x][y]
	}
}


Array.prototype.clone = function() {
	return this.slice(0);
}

Array.prototype.shuffle = function() {
	let array = this;
	for( let i = this.length - 1; i > 0; i-- ) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

class Solution {
	constructor( genes ) {
		this.genes = genes;
		this.cost = 0;
	}

	mutate( chance ) {
		if ( Math.random() > chance ) return;

    let index1 = parseInt( Math.random() * this.genes.length );
    let index2 = parseInt( Math.random() * this.genes.length );
    if( index1 !== index2 ) {
			let tempGene = this.genes[ index1 ];
			this.genes[ index1 ] = this.genes[ index2 ];
			this.genes[ index2 ] = tempGene;
		}
	}

	cross( solution ) {
		let child1 = [];
		let child2 = [];

		// fill part of genes in childs
	  let index1 = parseInt( Math.random() * this.genes.length );
	  let index2 = parseInt( Math.random() * ( this.genes.length - index1 ) + index1 );
		for( let i = index1; i < index2; i++ ) {
			child1[ i ] = this.genes[ i ];
			child2[ i ] = solution.genes[ i ];
		}

		// complete cross
		let indexChild1 = 0;
		let indexChild2 = 0;
		for( let i = 0; i < this.genes.length; i++ ) {
			// complete child1
			// if child1 hasn't gene
			if( child1.indexOf( solution.genes[ i ] ) === -1 ) {
				// if gene in child1 is empty
				if( child1[ indexChild1 ] === undefined ) {
					child1[ indexChild1 ] = solution.genes[ i ];
					indexChild1++;
				}
				else {
					// search for empty gene
					while( child1[ indexChild1 ] !== undefined ) {
						indexChild1++;
					}
					child1[ indexChild1 ] = solution.genes[ i ];
					indexChild1++;
				}
			}

			// complete child2
			// if child2 hasn't gene
			if( child2.indexOf( this.genes[ i ] ) === -1 ) {
				// if gene in child2 is empty
				if( child2[ indexChild2 ] === undefined ) {
					child2[ indexChild2 ] = this.genes[ i ];
					indexChild2++;
				}
				else {
					// search for empty gene
					while( child2[ indexChild2 ] !== undefined ) {
						indexChild2++;
					}
					child2[ indexChild2 ] = this.genes[ i ];
					indexChild2++;
				}
			}

		}

		return [ new Solution( child1 ), new Solution( child2 ) ];
	}

	countCost( costTable ) {
		let cost = 0;

		for( let i = 0; i < this.genes.length; i++ ) {
			cost += costTable[ i ].cost[ this.genes[ i ] ];
		}

		this.cost = cost;
		//console.log( 'cost:', cost, this.genes.length, this.genes );
		return cost;
	}
};

class Population {
	constructor( genes, size, mutateProb ) {
    this.members = [];
    this.generationNumber = 0;
		this.best = { cost: Number.MAX_VALUE };
		this.mutateProb = mutateProb;
		this.size = size;
    while (size--) {
			let newGenes = genes.clone().shuffle();
      let solution = new Solution( newGenes );
      this.members.push( solution );
    }
	}

	findBest( costTable ) {
	  let best = undefined;
		let bestCost = Number.MAX_VALUE;
		for( let i = 0; i < this.members.length; i++ ) {
			if( !this.members[ i ].cost ) {
				this.members[ i ].countCost( costTable );
				console.log( 'members', this.members[ i ].cost );
			}
			if( this.members[ i ].cost < bestCost ) {
				best = this.members[ i ];
				bestCost = this.members[ i ].cost;
			}
		}
		this.best = best;
		return best;
	}

	generation( costTable ) {
		// create new population
		let newMembers = [];

    for ( let i = 0; i < this.members.length/2; i++ ) {
			let winners = [];
			// selection by tournament method
			for( let j = 0; j < 2; j++ ) {
				let randomIndex1 = parseInt( Math.random() * this.members.length );
				let randomIndex2 = parseInt( Math.random() * this.members.length );
				//console.log( this.members[ randomIndex1 ], this.members[ randomIndex2 ] );
				if( this.members[ randomIndex1 ].cost <= this.members[ randomIndex2 ].cost ) {
					winners[ j ] = this.members[ randomIndex1 ];
				}
				else {
					winners[ j ] = this.members[ randomIndex2 ];
				}
			}
			let children = winners[0].cross( winners[1] );
			//console.log( 'children', children );
			for( let j = 0; j < children.length; j++ ) {
				children[ j ].mutate( this.mutateProb );
				children[ j ].countCost( costTable );
				if( !this.best || children[ j ].cost < this.best.cost ) {
					this.best = children[ j ];
				}
				newMembers.push( children[ j ] );
			}
    }
		this.members = newMembers;
	  this.generationNumber++;
	}

	start( amount, costTable ) {
	  for ( let i = 0; i < this.members.length; i++ ) {
	      this.members[i].countCost( costTable );
	  }
		this.findBest( costTable );
		console.log( 'Best in ' + this.generationNumber + ':', this.best );

		while( this.generationNumber < amount && this.best.cost > 0 ) {
			this.generation( costTable );
			console.log( 'Best in ' + this.generationNumber + ':', this.best );
		}
	}
};

class GeneticAlgorithm {
	constructor( genes, costTable, populationSize = 500, mutateProb = 0.7, amount = 300 ) {
		this.genes = genes;
		this.costTable = costTable;
		this.population = new Population( genes, populationSize, mutateProb );
		this.amount = amount;
	}

	start() {
		this.population.start( this.amount, this.costTable );
	}
};

/*
// TEST
jQuery( document ).ready( function() {

	let genes = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

	//let population = new Population( genes, 500, 0.7 );
	//population.start( 300 );

	console.log( 'Start Algorithm...' );

	let geneticAlgorithm = new GeneticAlgorithm( genes, costTable, 500, 0.7, 300 );

	console.log( 'Parameters: ', 'Population size: ' + geneticAlgorithm.populationSize,
 		'Mutation\'s probability: ' + geneticAlgorithm.mutateProb, 'Amount: ' + geneticAlgorithm.amount );

	geneticAlgorithm.start();

	console.log( 'Stop', 'Best: ', geneticAlgorithm.population.best );

} );
*/


var Taxi = function() {
	this.cost = [];

}

function cloneArray( array ) {
	var newArray = [];
	for( var i = 0; i < array.length; i++ ) {
		newArray.push( array[ i ] );
	}
	return newArray;
}

function generateArray( array ) {
	var tempArray = cloneArray( array );
	var goalArray = [];
	while( tempArray.length ) {
		var randomIndex = parseInt( Math.random() * tempArray.length );
		goalArray.push( tempArray[ randomIndex ] );
		tempArray.splice( randomIndex, 1 );
	}
	return goalArray;
}

var Solution = function( genes ) {
	this.genes = genes;
	this.cost = 0;
};

Solution.prototype.mutate = function( chance ) {
    if ( Math.random() > chance ) return;

    var index1 = parseInt( Math.random() * this.genes.length );
    var index2 = parseInt( Math.random() * this.genes.length );
    if( index1 != index2 ) {
		var tempGene = this.genes[ index1 ];
		this.genes[ index1 ] = this.genes[ index2 ];
		this.genes[ index2 ] = tempGene;
	}
};

Solution.prototype.cross = function( solution ) {
	var child1 = [];
	var child2 = [];

	// fill part of genes in childs
  var index1 = parseInt( Math.random() * this.genes.length );
  var index2 = parseInt( Math.random() * ( this.genes.length - index1 ) + index1 );
	for( var i = index1; i < index2; i++ ) {
		child1[ i ] = this.genes[ i ];
		child2[ i ] = solution.genes[ i ];
	}

	// complete cross
	var indexChild1 = 0;
	var indexChild2 = 0;
	for( var i = 0; i < this.genes.length; i++ ) {
		// complete child1
		// if child1 hasn't gene
		if( child1.indexOf( solution.genes[ i ] ) == -1 ) {
			// if gene in child1 is empty
			if( child1[ indexChild1 ] == undefined ) {
				child1[ indexChild1 ] = solution.genes[ i ];
				indexChild1++;
			}
			else {
				// search for empty gene
				while( child1[ indexChild1 ] != undefined ) {
					indexChild1++;
				}
				child1[ indexChild1 ] = solution.genes[ i ];
				indexChild1++;
			}
		}

		// complete child2
		// if child2 hasn't gene
		if( child2.indexOf( this.genes[ i ] ) == -1 ) {
			// if gene in child2 is empty
			if( child2[ indexChild2 ] == undefined ) {
				child2[ indexChild2 ] = this.genes[ i ];
				indexChild2++;
			}
			else {
				// search for empty gene
				while( child2[ indexChild2 ] != undefined ) {
					indexChild2++;
				}
				child2[ indexChild2 ] = this.genes[ i ];
				indexChild2++;
			}
		}

	}

	return [ new Solution( child1, this.originalArray ), new Solution( child2, solution.originalArray ) ];
};

Solution.prototype.countCost = function( taxiArray ) {
	var cost = 0;

	for( var i = 0; i < this.genes.length; i++ ) {
		cost += taxiArray[ i ].cost[ this.genes[ i ] ];
	}

	this.cost = cost;
	//console.log( 'cost:', cost, this.genes.length, this.genes );
	return cost;
};

var Population = function( genes, size, mutateProb ) {
    this.members = [];
    this.generationNumber = 0;
		this.best = { cost: Number.MAX_VALUE };
		this.mutateProb = mutateProb;
		this.size = size;
    while (size--) {
			var tempArray = generateArray( genes );
      var solution = new Solution( tempArray );
      this.members.push( solution );
    }
};

Population.prototype.findBest = function( taxiArray ) {
  var best = undefined;
	var bestCost = Number.MAX_VALUE;
	for( var i = 0; i < this.members.length; i++ ) {
		if( !this.members[ i ].cost ) {
			this.members[ i ].countCost( taxiArray );
			console.log( 'members', this.members[ i ].cost );
		}
		if( this.members[ i ].cost < bestCost ) {
			best = this.members[ i ];
			bestCost = this.members[ i ].cost;
		}
	}
	this.best = best;
	return best;
};

Population.prototype.generation = function( taxiArray ) {

	// create new population
	var newMembers = [];

    for ( var i = 0; i < this.members.length/2; i++ ) {
			var winners = [];
			// selection by tournament method
			for( var j = 0; j < 2; j++ ) {
				var randomIndex1 = parseInt( Math.random() * this.members.length );
				var randomIndex2 = parseInt( Math.random() * this.members.length );
				//console.log( this.members[ randomIndex1 ], this.members[ randomIndex2 ] );
				if( this.members[ randomIndex1 ].cost <= this.members[ randomIndex2 ].cost ) {
					winners[ j ] = this.members[ randomIndex1 ];
				}
				else {
					winners[ j ] = this.members[ randomIndex2 ];
				}
			}
			var children = winners[0].cross( winners[1] );
			//console.log( 'children', children );
			for( var j = 0; j < children.length; j++ ) {
				children[ j ].mutate( this.mutateProb );
				children[ j ].countCost( taxiArray );
				if( !this.best || children[ j ].cost < this.best.cost ) {
					this.best = children[ j ];
				}
				newMembers.push( children[ j ] );
			}
    }
	this.members = newMembers;
  this.generationNumber++;
};

Population.prototype.start = function( amount, taxiArray ) {
  for ( var i = 0; i < this.members.length; i++ ) {
      this.members[i].countCost( taxiArray );
  }
	this.findBest( taxiArray );
	console.log( 'Best in ' + this.generationNumber + ':', this.best );

	while( this.generationNumber < amount && this.best.cost > 0 ) {
		this.generation( taxiArray );
		console.log( 'Best in ' + this.generationNumber + ':', this.best );
	}
}

var GeneticAlgorithm = function( clientsArray, taxiArray, populationSize, mutateProb, amount ) {
	this.clientsArray = clientsArray;
	this.taxiArray = taxiArray;
	this.population = new Population( clientsArray, populationSize, mutateProb );
	this.amount = amount;
}

GeneticAlgorithm.prototype.start = function( ) {
	this.population.start( this.amount, this.taxiArray );
}

/*
// TEST
jQuery( document ).ready( function() {

	var clientsArray = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

	//var population = new Population( clientsArray, 500, 0.7 );
	//population.start( 300 );

	console.log( 'Start Algorithm...' );

	var geneticAlgorithm = new GeneticAlgorithm( clientsArray, taxiArray, 500, 0.7, 300 );

	console.log( 'Parameters: ', 'Population size: ' + geneticAlgorithm.populationSize,
 		'Mutation\'s probability: ' + geneticAlgorithm.mutateProb, 'Amount: ' + geneticAlgorithm.amount );

	geneticAlgorithm.start();

	console.log( 'Stop', 'Best: ', geneticAlgorithm.population.best );

} );
*/

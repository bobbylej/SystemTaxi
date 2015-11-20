
var Taxi = function() {
	this.road = [];

}
/*
var taxi1 = new Taxi();
var taxi2 = new Taxi();
var taxi3 = new Taxi();
var taxi4 = new Taxi();
var taxi5 = new Taxi();
var taxi6 = new Taxi();
var taxi7 = new Taxi();
var taxi8 = new Taxi();
var taxi9 = new Taxi();
var taxi10 = new Taxi();
var taxi11 = new Taxi();
var taxi12 = new Taxi();

taxi1.road[2] = 30;
taxi1.road[3] = 30;
taxi1.road[4] = 30;
taxi1.road[5] = 30;
taxi1.road[6] = 3;
taxi1.road[7] = 66;
taxi1.road[8] = 54;
taxi1.road[9] = 897;
taxi1.road[10] = 52;
taxi1.road[11] = 4;
taxi1.road[12] = 221;
taxi1.road[13] = 11;

taxi2.road[2] = 40;
taxi2.road[3] = 3;
taxi2.road[4] = 100;
taxi2.road[5] = 30;
taxi2.road[6] = 45;
taxi2.road[7] = 87;
taxi2.road[8] = 41;
taxi2.road[9] = 14;
taxi2.road[10] = 65;
taxi2.road[11] = 47;
taxi2.road[12] = 55;
taxi2.road[13] = 23;

taxi3.road[2] = 80;
taxi3.road[3] = 20;
taxi3.road[4] = 12;
taxi3.road[5] = 45;
taxi3.road[6] = 57;
taxi3.road[7] = 8;
taxi3.road[8] = 45;
taxi3.road[9] = 68;
taxi3.road[10] = 24;
taxi3.road[11] = 36;
taxi3.road[12] = 4;
taxi3.road[13] = 85;

taxi4.road[2] = 21;
taxi4.road[3] = 12;
taxi4.road[4] = 10;
taxi4.road[5] = 30;
taxi4.road[6] = 44;
taxi4.road[7] = 22;
taxi4.road[8] = 54;
taxi4.road[9] = 33;
taxi4.road[10] = 65;
taxi4.road[11] = 9;
taxi4.road[12] = 55;
taxi4.road[13] = 4;

taxi5.road[2] = 30;
taxi5.road[3] = 30;
taxi5.road[4] = 30;
taxi5.road[5] = 30;
taxi5.road[6] = 3;
taxi5.road[7] = 66;
taxi5.road[8] = 54;
taxi5.road[9] = 897;
taxi5.road[10] = 52;
taxi5.road[11] = 4;
taxi5.road[12] = 221;
taxi5.road[13] = 11;

taxi6.road[2] = 40;
taxi6.road[3] = 3;
taxi6.road[4] = 100;
taxi6.road[5] = 30;
taxi6.road[6] = 45;
taxi6.road[7] = 87;
taxi6.road[8] = 41;
taxi6.road[9] = 14;
taxi6.road[10] = 65;
taxi6.road[11] = 47;
taxi6.road[12] = 55;
taxi6.road[13] = 23;

taxi7.road[2] = 80;
taxi7.road[3] = 20;
taxi7.road[4] = 12;
taxi7.road[5] = 45;
taxi7.road[6] = 57;
taxi7.road[7] = 8;
taxi7.road[8] = 45;
taxi7.road[9] = 68;
taxi7.road[10] = 24;
taxi7.road[11] = 36;
taxi7.road[12] = 4;
taxi7.road[13] = 85;

taxi8.road[2] = 21;
taxi8.road[3] = 12;
taxi8.road[4] = 10;
taxi8.road[5] = 30;
taxi8.road[6] = 44;
taxi8.road[7] = 22;
taxi8.road[8] = 54;
taxi8.road[9] = 33;
taxi8.road[10] = 65;
taxi8.road[11] = 9;
taxi8.road[12] = 55;
taxi8.road[13] = 4;


taxi9.road[2] = 30;
taxi9.road[3] = 30;
taxi9.road[4] = 30;
taxi9.road[5] = 30;
taxi9.road[6] = 3;
taxi9.road[7] = 66;
taxi9.road[8] = 54;
taxi9.road[9] = 897;
taxi9.road[10] = 52;
taxi9.road[11] = 4;
taxi9.road[12] = 221;
taxi9.road[13] = 11;

taxi10.road[2] = 40;
taxi10.road[3] = 3;
taxi10.road[4] = 100;
taxi10.road[5] = 30;
taxi10.road[6] = 45;
taxi10.road[7] = 87;
taxi10.road[8] = 41;
taxi10.road[9] = 14;
taxi10.road[10] = 65;
taxi10.road[11] = 47;
taxi10.road[12] = 55;
taxi10.road[13] = 23;

taxi11.road[2] = 80;
taxi11.road[3] = 20;
taxi11.road[4] = 12;
taxi11.road[5] = 45;
taxi11.road[6] = 57;
taxi11.road[7] = 8;
taxi11.road[8] = 45;
taxi11.road[9] = 68;
taxi11.road[10] = 24;
taxi11.road[11] = 36;
taxi11.road[12] = 4;
taxi11.road[13] = 85;

taxi12.road[2] = 21;
taxi12.road[3] = 12;
taxi12.road[4] = 10;
taxi12.road[5] = 30;
taxi12.road[6] = 44;
taxi12.road[7] = 22;
taxi12.road[8] = 54;
taxi12.road[9] = 33;
taxi12.road[10] = 65;
taxi12.road[11] = 9;
taxi12.road[12] = 55;
taxi12.road[13] = 4;

var taxiArray = [ taxi1, taxi2, taxi3, taxi4, taxi5, taxi6, taxi7, taxi8, taxi9, taxi10, taxi11, taxi12 ];
*/

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
		cost += taxiArray[ i ].road[ this.genes[ i ] ];
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

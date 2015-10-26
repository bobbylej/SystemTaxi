angular.module('DashboardModule').controller('DashboardController', ['$scope', '$http', 'toastr', function($scope){
  //console.log( $http );
  $scope.login = window.SAILS_LOCALS.me.login;
}]);

var orderMap = angular.module('orderMap', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all the orders and show them.
    $http.get('/api/orders')
        .success(function(data) {
            $scope.orders = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}
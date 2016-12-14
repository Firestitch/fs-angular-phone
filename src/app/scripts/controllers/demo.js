'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope) {


    $scope.disabled = false;
    $scope.required = false;
    $scope.phone = "4168884447";

    $scope.submit = function() {
        alert('submit');
    }
});


(function () {
    'use strict';

	/**
	 * @ngdoc directive
	 * @name fs.directives:fs-phone
	 * @restrict E
	 * @param {object} fsModel The modal object. The format should be in minnutes
	 * @param {string} fsLabel The input label
	 * @param {string} fsClass The css class pass on to the md-input-container
	 * @param {expression} fsDisabled An expression to enable/disable the input
	 * @param {expression} fsRequired An expression to require the input for valiation
	 */
    angular.module('fs-angular-phone',['fs-angular-util','fs-angular-validate'])
    .directive('fsPhone', function($filter, fsUtil, fsValidate, $timeout) {
        return {
            templateUrl: 'views/directives/phone.html',
            restrict: 'E',
            replace: true,
            scope: {
              model: '=?fsModel',
              label: '@?fsLabel',
              disabled: '=?fsDisabled',
              required: '=?fsRequired',
              class: '@?fsClass'
            },
            link: function($scope, element, attrs, ctrl) {

	            var input = angular.element(element[0].querySelector('input[type="text"]'))[0];
	            $scope.name = 'input_' + fsUtil.guid();
				$scope.input = '';

				$scope.change = function(e) {

				    var val = angular.element(input).val(),
				    	start = input.selectionStart,
				    	end = input.selectionEnd;

				    update(val);

				    if(val.length>start) {

					    $timeout(function () {
					    	input.setSelectionRange(start, end);
					    },5);
					}

	            	$scope.model = $scope.input.replace(/[^0-9]/g,'');
	            }

	            $scope.keydown = function(e) {

	            	var codes = [	35, //end
	            					36, //home
	            					37, //back
	            					39, //forward
	            					46, //delete
	            					8]; //backspace

	            	if(!e.shiftKey && !e.ctrlKey && codes.indexOf(e.keyCode)<0 && !e.key.match(/[\d\(\)]/)) {
	            		e.preventDefault();
	            	}
	            }

	            angular.element(input).data('scope',$scope);

	            $scope.validate = function(value) {

	            	if(!fsValidate.phone(value)) {
	            		return 'Invalid phone number';
	            	}

	            	return true;
	            }

	            function update(value) {

	            	if(!value) {
	            		value = "";
	            	}

	            	value = value.toString();

	            	$scope.input = $filter('tel')(value.replace(/[^0-9]/g, ''), false);
	            }

	            update($scope.model);
            }
        };
    })
    .filter('tel', function () {
	    return function (tel) {
	        if (!tel) { return ''; }

	        var value = tel.toString().trim().replace(/^\+/, '');

	        if (value.match(/[^0-9]/)) {
	            return tel;
	        }

	        var country, city, number;

	        switch (value.length) {
	            case 1:
	            case 2:
	            case 3:
	                city = value;
	                break;

	            default:
	                city = value.slice(0, 3);
	                number = value.slice(3);
	        }

	        if(number){
	            if(number.length>3){
	                number = number.slice(0, 3) + '-' + number.slice(3,7);
	            }
	            else{
	                number = number;
	            }

	            return ("(" + city + ") " + number).trim();
	        }
	        else{
	            return "(" + city;
	        }

	    };
	});
})();



angular.module('fs-angular-phone').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/phone.html',
    "<md-input-container class=\"fs-phone {{class}}\">\r" +
    "\n" +
    "\t<label ng-show=\"label\">{{label}}</label>\r" +
    "\n" +
    "\t<input \ttype=\"text\"\r" +
    "\n" +
    "\t\t\tng-model=\"input\"\r" +
    "\n" +
    "\t\t\taria-label=\"Phone\"\r" +
    "\n" +
    "\t\t\tng-disabled=\"disabled\"\r" +
    "\n" +
    "\t\t\tng-keyup=\"change($event)\"\r" +
    "\n" +
    "\t\t\tng-keydown=\"keydown($event)\"\r" +
    "\n" +
    "\t\t\tng-required=\"{{required}}\"\r" +
    "\n" +
    "\t\t\tname=\"{{name}}\"\r" +
    "\n" +
    "\t\t\tcustom=\"validate\">\r" +
    "\n" +
    "\t<input type=\"hidden\" ng-model=\"model\">\r" +
    "\n" +
    "</md-input-container>"
  );

}]);

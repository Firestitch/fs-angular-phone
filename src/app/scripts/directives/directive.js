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
            controller: ['$scope',function($scope) {
            	$scope.name = 'input_' + fsUtil.guid();
            }],
            link: function($scope, element, attrs, ctrl) {

	            var input = angular.element(element[0].querySelector('input[type="text"]'))[0];
				$scope.input = '';

				$scope.change = function(e) {

				    var val = angular.element(input).val(),
				    	pos = input.selectionStart;

				    if(val) {
				    	val = val.toString().replace(/^1/,'');
				    }

				    update(val);

				    if(val.length>pos) {

					    $timeout(function() {
					    	input.setSelectionRange(pos,pos);
					    });
					}

	            	$scope.model = $scope.input.replace(/[^0-9]/g,'');
	            }

	            $scope.keydown = function(e) {

	            	var codes = [	35, //end
	            					36, //home
	            					37, //back
	            					39, //forward
	            					46, //delete
	            					9,  //tab
	            					8]; //backspace

	            	if(!e.shiftKey && !e.ctrlKey && codes.indexOf(e.keyCode)<0 && !e.key.match(/[\d\(\)]/)) {
	            		e.preventDefault();
	            	}
	            }

	            angular.element(input).data('scope',$scope);
	            update($scope.model);

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

	            	$scope.input = format(value);
	            }

				function format(value) {
			        if (!value) {
			        	return '';
			        }

			        var value = value.replace(/[^0-9]/g, '');

			        if (value.match(/[^0-9]/)) {
			            return tel;
			        }

			        var country, city, number;

			        if(value.length<=3) {
			            city = value;
			        } else {
			        	city = value.slice(0, 3);
			            number = value.slice(3);
			        }

			        if(number) {
			            if(number.length>3){
			                number = number.slice(0, 3) + '-' + number.slice(3,7);
			            } else{
			                number = number;
			            }

			            return ("(" + city + ") " + number).trim();
			        } else {
			            return "(" + city;
			        }
			    }
            }
        };
    });
})();


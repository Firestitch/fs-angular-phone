
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
    angular.module('fs-angular-phone',['fs-angular-util','fs-angular-validate','fs-angular-model'])
  .directive('fsPhone', function($filter, fsUtil, fsValidate, $timeout) {
        return {
            templateUrl: 'views/directives/phone.html',
            restrict: 'E',
            replace: true,
            scope: {
            	model: '=fsModel',
            	label: '@?fsLabel',
             	disabled: '=?fsDisabled',
              	class: '@?fsClass',
              	required: '@?fsRequired'
            },
            controller: function($scope) {
            	$scope.name = 'input_' + fsUtil.guid();

	            $scope.validatePhone = function(value) {

	            	if(!fsValidate.phone(value)) {
	            		return 'Invalid phone number';
	            	}

	            	return true;
	            }
            }
        }
    })
    .directive('fsPhoneInput', function($filter, fsValidate, $timeout, fsUtil) {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function($scope, element, attrs, modelCtrl) {

	            var listener = function() {
	                var value = element.val().replace(/[^0-9]/g, '');
	                element.val(format(value));
	            }

	            modelCtrl.$parsers.push(function(viewValue) {
	                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
	            });

	            modelCtrl.$render = function() {
	            	element.val(format(modelCtrl.$viewValue));
	            }

	            element.bind('keydown', function(event) {

					var key = event.keyCode;
					// If the keys include the CTRL, BACKSPACE, TAB, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
	                if (key == fsUtil.KEY_DELETE || key == fsUtil.KEY_BACKSPACE || key == fsUtil.KEY_TAB || (15 < key && key < 19) || (37 <= key && key <= 40)){
	                    return;
	                }

	                var value = element.val().toString();
	            	if(event.key.match(/[^0-9]/))
	            		return event.preventDefault();

	            	if((event.target.selectionStart==event.target.selectionEnd) && value.replace(/[^0-9]/g, '').length>=10)
	            		return event.preventDefault();


	                listener();
	            });

	            element.bind('change paste cut', function() {
	            	listener(listener);
	            });

	            function format(tel) {

			        if (!tel) {
			        	return '';
			        }

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
	            }

            }
        };
    });
})();
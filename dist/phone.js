

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
            link: function($scope) {
            	$scope.name = 'input_' + fsUtil.guid();
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

	            //HACK In order to run this validation it has to be placed in a scope that fs-validate can see
	            $scope.fsPhoneCustom = function(value) {

	            	if(!fsValidate.phone(value)) {
	            		return 'Invalid phone number';
	            	}

	            	return true;
	            }

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

angular.module('fs-angular-phone').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/phone.html',
    "<md-input-container class=\"fs-phone {{class}}\">\r" +
    "\n" +
    "\t<label ng-show=\"label\">{{label}}</label>\r" +
    "\n" +
    "\t<input \ttype=\"text\"\r" +
    "\n" +
    "\t\t\tng-model=\"model\"\r" +
    "\n" +
    "\t\t\taria-label=\"Phone\"\r" +
    "\n" +
    "\t\t\tng-disabled=\"disabled\"\r" +
    "\n" +
    "\t\t\tname=\"{{name}}\"\r" +
    "\n" +
    "\t\t\trequired-condition=\"{{required}}\"\r" +
    "\n" +
    "\t\t\tcustom=\"fsPhoneCustom\"\r" +
    "\n" +
    "\t\t\tfs-phone-input>\r" +
    "\n" +
    "</md-input-container>"
  );

}]);

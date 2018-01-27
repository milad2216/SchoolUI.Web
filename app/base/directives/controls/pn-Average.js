define(['angularAMD'], function (control) {
	control.directive('pnAverage', function () {
		return {
			replace: false,
			restrict: 'EA',
			scope: {
				model: "=ngModel"
			},
			require: '?ngModel',
			template: '<div class="col-md-6"><input type="text" ng-model="model"  ng-keyup="keypress()" maxlength="5" class="form-control"/></div><div class="col-md-6"><input ng-model="model2" class="form-control" type="text"  readonly/></div>',
			link: function ($scope, $elem, $attrs, ngModelCtrl) {
				
				$scope.keypress = function () {

					if ($scope.model) {
						
						$scope.model = $scope.model.replace(/[^0-9 ]/g, '');
						$scope.model = $scope.model.replace(/^([0-9]{2})([0-9]{1,2})/g, '$1/$2');
						
						var avarage = $scope.model.split('/');
						firstPartAvarage = avarage[0];
						secondPartAvarage = avarage[1];
						if (firstPartAvarage == 20) {
							
							secondPartAvarage = "";
							$scope.model = "20";
						}
						if ($scope.model > 20) {
							$scope.model = "";
						}
						if ($scope.model >= 20) {
							$scope.model = "20";
						}
					
					}
					NumberToWords($scope.model);
				};
				//
				var defaults = {
					units: ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده"],
					teens: ["یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده", "بیست"],
					tens: ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"],
				};

				var o = defaults;
				var units = o.units;
				var teens = o.teens;
				var tens = o.tens;

				var getBelowHundred = function (n) {
					if (n <= 10) {
						return units[n];
					};
					if (n <= 20) {
						return teens[n - 10 - 1];
					};
					var unit = Math.floor(n % 10);
					n /= 10;
					var ten = Math.floor(n % 10);
					var tenWord = (ten > 0 ? (tens[ten] + " ") : '');
					var unitWord = (unit > 0 ? units[unit] : '');
					return tenWord + unitWord;
				};

				var getBelowThousand = function (n) {
					var word = getBelowHundred(Math.floor(n % 100));
					
					return word;
				};

				var getBelowThousand2 = function (n) {
					var word = getBelowHundred(Math.floor(n % 100));
					
					return word;
				};
				//
				function NumberToWords(n) {
				
					var b = n.split("/");
					n = b[0];
					d = b[1];
					word = getBelowThousand(n);
					word2 = getBelowThousand2(d);
					if (d < 10) {
						dahomorsadom = 'دهم ';
					} else {
						dahomorsadom = 'صدم ';
					}

					if (word != '') word = word.toUpperCase() + ' ';
					if (word2 != '') word2 = ' و ' + word2.toUpperCase() + '  ' + dahomorsadom;
					var all = word + word2;
					$scope.model2 = all;
				}
			},
		};

	});
});
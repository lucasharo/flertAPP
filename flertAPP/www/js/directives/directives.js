app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})

.directive('ngUnique', function ($http, Config) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            elem.bind('blur', function (evt) {
                ctrl.$setValidity('unique', true);

                $http.post(Config.ambiente.urlServer + attrs.ngUnique, { data: elem.val() }).then(function (data) {
                    ctrl.$setValidity('unique', true);
                }, function (erro) {
                    ctrl.$setValidity('unique', false);
                });
            });
        }
    }
})
.directive('focusMe', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });

            element.bind('blur', function () {
                scope.$apply(model.assign(scope, false));
            })
        }
    };
})

.directive('ngLoad', function($parse){
	return {
	    restrict: 'A',
	    compile: function($element, attr) {
	        var fn = $parse(attr['ngLoad']);
			
	        return function(scope, element, attr) {
	            element.on('load', function(event) {
	                scope.$apply(function() {
	                    fn(scope, {$event:event});
	                });
	            });
	        }
	    }
	}
})

.directive('searchBar', [function () {
	return {
		scope: {
			ngModel: '='
		},
		require: ['^ionNavBar', '?ngModel'],
		restrict: 'E',
		replace: true,
		template: '<ion-nav-buttons side="right">'+
						'<div class="searchBar">'+
							'<div class="searchTxt" ng-show="ngModel.show">'+
						  		'<div class="bgdiv"></div>'+
						  		'<div class="bgtxt">'+
						  			'<input type="text" placeholder="Procurar..." ng-model="ngModel.txt">'+
						  		'</div>'+
					  		'</div>'+
						  	'<i class="icon placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>'+
						'</div>'+
					'</ion-nav-buttons>',
		
		compile: function (element, attrs) {
			var icon=attrs.icon
					|| (ionic.Platform.isAndroid() && 'ion-android-search')
					|| (ionic.Platform.isIOS()     && 'ion-ios7-search')
					|| 'ion-search';
			angular.element(element[0].querySelector('.icon')).addClass(icon);
			
			return function($scope, $element, $attrs, ctrls) {
				var navBarCtrl = ctrls[0];
				$scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
				
			};
		},
		controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
			var title, definedClass;
			$scope.$watch('ngModel.show', function(showing, oldVal, scope) {
				if(showing!==oldVal) {
					if(showing) {
						if(!definedClass) {
							var numicons=$scope.navElement.children().length;
							angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
						}
						
						title = $ionicNavBarDelegate.getTitle();
						$ionicNavBarDelegate.setTitle('');
					} else {
						$ionicNavBarDelegate.setTitle(title);
					}
				} else if (!title) {
					title = $ionicNavBarDelegate.getTitle();
				}
			});
		}]
	};
}])

.directive('spinnerLocal', function (){
	return {
		restrict: 'E',
		replace: true,
		template: '<div style="text-align: center; padding-top: 10px" class="ng-hide">' +
				  '    <div class="preloader-wrapper small active">' +
				  '        <div class="spinner-layer accent-3-border-color">               ' +
				  '            <div class="circle-clipper left">                           ' +
				  '                <div class="circle"></div>                              ' +
				  '            </div>                                                      ' +
				  '            <div class="gap-patch">                                     ' +
				  '                <div class="circle"></div>                              ' +
				  '            </div>                                                      ' +
				  '            <div class="circle-clipper right">                          ' +
				  '                <div class="circle"></div>                              ' +
				  '            </div>                                                      ' +
				  '        </div>                                                          ' +
				  '    </div>                                                              ' +
				  '</div>                                                                  ' ,
	    link: function (scope, elm, attrs)
	    {	   	
	        scope.$watch(attrs.show, function (show)
	        {
	            if(show){
	                elm.removeClass('ng-hide');
	            }else{
	                elm.addClass('ng-hide');
	            }
	        });
		}
	}
})

.directive('imgAnonimo', function () {
    return {
        link: function (scope, element, attrs) {
			var img = element.find('img');
			img.src = 'img/anonimo.png';

			if (img.naturalWidth === 0) {				
				element.src = 'img/anonimo.png';
			}
		}
    };
})

.directive('fakeStatusbar', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="fake-statusbar"><div class="pull-left">Carrier</div><div class="time">3:30 PM</div><div class="pull-right">50%</div></div>'
  }
})

.directive('headerShrink', function($document, $timeout) {
	
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(header.offsetHeight - 44, amt);
    fadeAmt = 1 - amt / header.offsetHeight - 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
	  //content.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
	  
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
		$timeout(function(){
			var starty = orgStarty = $scope.$eval($attr.headerShrink) || 40;
			var shrinkAmt;
			
			var content = document.getElementById('content-empresa');
			var header = document.getElementById('img-empresa');
			var headerHeight = header.offsetHeight;
			
			$element.bind('scroll', function(e) { 
			 shrinkAmt = headerHeight - (headerHeight - (e.target.scrollTop - starty));

			 if (shrinkAmt >= headerHeight){
			//header is totaly hidden - start moving startY downward so that when scrolling up the header starts showing
			starty = (e.target.scrollTop - headerHeight);
			shrinkAmt = headerHeight;
			 } else if (shrinkAmt < 0){
			//header is totaly displayed - start moving startY upwards so that when scrolling down the header starts shrinking
			starty = Math.max(orgStarty, e.target.scrollTop);
			shrinkAmt = 0;
			 }
			 
			 
			 
			 shrink(header, $element[0], shrinkAmt, headerHeight); //do the shrinking   
			
			});
		});
    }
  }
})

.directive('scrollWatch', function($rootScope) {
  return function(scope, elem, attr) {    
    elem.bind('scroll', function(e) {
      if(e.target.scrollTop < $rootScope.pixelLimit) {
        $rootScope.slideHeader = false;
      } else {
        $rootScope.slideHeader = true;
      }
      $rootScope.$apply();
    });
  };
});
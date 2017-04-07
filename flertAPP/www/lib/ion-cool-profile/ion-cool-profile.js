/*
 *  Author : Rishi Vedpathak
 *  Date : 30/11/2016
 *  Repository : ionic-cool-profile
 *  The MIT License (MIT) - Copyright (c) [2015] [Rishikesh Vedpathak]
 */

angular.module('ion-cool-profile', [])
    .directive('ionParallaxProfile', function($ionicScrollDelegate, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elm, attr) {
				$timeout(function(){
					elm.bind('scroll', function() {
						scope.scroll();
					});
					elm.bind('touchmove', function() {
						scope.scroll();
					});
					var headerHeight = angular.element('[user-profile-header]').innerHeight();
					elm.css({
						top: headerHeight + 'px'
					});
					scope.scroll = function() {
						var scrollPos = $ionicScrollDelegate.$getByHandle('profileScroll').getScrollPosition();
						var element = angular.element('[user-profile-header]');
						var header = angular.element('[user-profile-header]');
						var subHeader = angular.element('[user-profile-sub-header]');
						if (scrollPos.top <= (headerHeight - angular.element('[user-profile-sub-header]').innerHeight())) {
							element.css({
								webkitTransform: 'translate3d(0,-' + scrollPos.top + 'px,0)',
								transform: 'translate3d(0,-' + scrollPos.top + 'px,0)'
							});
							elm.css({
								top: (headerHeight - scrollPos.top) + 'px'
							});
							subHeader.hide();
							header.fadeIn();
						} else {
							element.css({
								webkitTransform: 'translate3d(0,-50px,0)',
								transform: 'translate3d(0,-50px,0)'
							});
							elm.css({
								top: angular.element('[user-profile-sub-header]').height() + 'px'
							});
							header.hide()
							subHeader.show();
						}
						$ionicScrollDelegate.resize();
					};
				});
            }
        }
    });

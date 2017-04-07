app.directive('noScroll', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        $element.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })

 .directive('photoPickable', function() {
   return {
     restrict: 'AE',
     scope: {
       number: '@',
       imgSrc: '=',
	defaultImage: '='
     },
     template: '' +
		'<div class="photo-pickable">' +
		'<span class="photo-number text-lg light">{{number}}</span>' +
		'<img preload-image ng-src="{{imgSrc}}" default-image="{{defaultImage}}" class="w-full r-3x" alt="">' +
		'</div>'
   }
 })

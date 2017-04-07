app.controller('ComentariosController', function ($scope, $stateParams, $sanitize, $ionicScrollDelegate, $ionicPopover, $timeout, $state, $localStorage, $rootScope, $window, Config, UsuariosService, ChatService, ChatService, FirebaseFactory, $firebaseObject, $firebaseArray, EmpresasFactory, ComentariosService, LoadService, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
    LoadService.show();

    $scope.comentarios = [];
    $scope.comentario = "";

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });

    var getEmpresa = function () {
        EmpresasFactory.getEmpresa($stateParams.empresaId, function (empresa) {
            $scope.empresa = empresa;
			
        	ComentariosService.getComentarios($scope.empresa.$id, function(comentarios){
				$scope.comentarios = comentarios;

        		$ionicScrollDelegate.scrollBottom();
					
				LoadService.hide();
			});
        });
    }

    $scope.enviaComentario = function (comentario) {
        if (comentario) {
			ComentariosService.enviaComentario(comentario, $scope.usuario);

            $scope.comentario = "";
        }
    }
	
	$scope.removeComentario = function (index) {		
		ComentariosService.removeComentario(index);
    }

    getEmpresa();
});
app.controller('ConfiguracaoController', function ($scope, $rootScope, $ionicModal, LoginService, ToastService) {
	/*$ionicModal.fromTemplateUrl('templates/altera-senha.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalAlteraSenha = modal;
    });*/
	
	
		
	$scope.alteraSenha = function (usuario) {
		if (usuario && usuario.senhaAntiga && usuario.senhaNova) {
			usuario.email = $rootScope.usuario.email;
			
			LoginService.alteraSenha(usuario, function (e, resultado) {
				if (e) {
					ToastService.erro(e);
				} else {
					ToastService.sucesso(resultado);
					
					$scope.usuarioSenha = null;

					$scope.modalAlteraSenha.hide();
				}
			});
		}
    }
});
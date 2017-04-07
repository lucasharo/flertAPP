app.controller('LoginController', function ($scope, $state, $rootScope, $ionicModal, LoginService, LoadService, ToastService, $ionicHistory) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
	
	/*$ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
	
	$ionicModal.fromTemplateUrl('templates/nova-senha.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modalNovaSenha = modal;
    });*/
	
	LoginService.verificaSessao();
	
	var login = function(email, senha){
		LoadService.show();

        LoginService.loginManual(email, senha, function (e, usuario) {
            if (e) {
                ToastService.erro(e);
            } else {
				LoginService.on(usuario.id);
				
                $state.go('home.explore', {}, { reload: true });
            }

            LoadService.hide();
        });
	}	
	
	$scope.cadastrarUsuario = function (novoUsuario) {
        if (novoUsuario && novoUsuario.email && novoUsuario.senha && novoUsuario.nome && novoUsuario.sexo) {
            LoadService.show();
			
			LoginService.cadastrarUsuario(novoUsuario, function(e){
				if(e){
					ToastService.erro(e);
				}else{
					$scope.modal.hide();
					
					LoginService.on(usuario.id);
				
					$state.go('home.explore', {}, { reload: true });
				}
				
				LoadService.hide();
			});
        } else{
			LoadService.hide();
			
            ToastService.erro("Por favor preencha todos os campos.");
		}
    }

    $scope.signIn = function (usuario) {
        if (usuario && usuario.email && usuario.senha) {
            login(usuario.email, usuario.senha);
        } else{			
            ToastService.erro("Por favor preencha todos os campos.");
		}
    }
	
    $scope.loginFacebook = function (username) {
		//$state.go('tabSlide', {}, { reload: true });
		//return;
        LoadService.show();

        LoginService.loginFacebook(function (e, usuario) {
            if (e) {
				LoadService.hide();
				
                ToastService.erro(e);
            } else {				
				LoginService.on(usuario.id);
				
				$state.go('home.explore', {}, { reload: true });
            }

            LoadService.hide();
        });
    }

    $scope.loginInstagram = function (username) {
        LoadService.show();

        LoginService.loginInstagram(function (e, usuario) {
            if (e) {
                ToastService.erro(e);
            } else {
                LoginService.setCredentials(usuario);
            }

            LoadService.hide();
        });
    }

    $scope.loginTwitter = function () {
        LoadService.show();

        LoginService.loginTwitter(function (e, usuario) {
            if (e) {
                ToastService.erro(e);
            } else {
                LoginService.setCredentials(usuario.screen_name, usuario.name, usuario.profile_image_url_https);
            }

            LoadService.hide();
        });
    }

    $scope.loginGoogle = function () {
        LoadService.show();

        LoginService.loginGoogle(function (e, usuario) {
            if (e) {
                ToastService.erro(e);
            } else {
                LoginService.setCredentials(usuario.email, usuario.name, usuario.picture);
            }

            LoadService.hide();
        });
    }

    $scope.geraNovaSenha = function (usuario) {
		if (usuario && usuario.email) {
			LoginService.geraNovaSenha(usuario, function (e, resultado) {
				if (e) {
					ToastService.erro(e);
				} else {
					ToastService.sucesso(resultado);

					$scope.modalNovaSenha.hide();
				}
			});
		}
    }
});



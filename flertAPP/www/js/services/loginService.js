app.service('LoginService', function ($rootScope, $state, FirebaseFactory, UsuarioFactory, LoadService, PushService) {
    return {
		verificaSessao: function(){
			LoadService.show();
			
			FirebaseFactory.auth().$onAuthStateChanged(function(authData) {
				console.log(authData);
				if (authData) {
					UsuarioFactory.getUsuario(authData.uid, function(){
						UsuarioFactory.setUsuario(authData.uid, $rootScope.usuario.provider, $rootScope.usuario.nome, $rootScope.usuario.email, $rootScope.usuario.sexo, $rootScope.usuario.email, $rootScope.usuario.descricao, $rootScope.usuario.img, $rootScope.usuario.visivel, $rootScope.usuario.filtro, $rootScope.usuario.push, $rootScope.usuario.curtidas);

						$state.go('home.explore', {}, { reload: true });

						if(!dev){						
							PushService.init();
					
							//navigator.splashscreen.hide();
						}
							
						LoadService.hide();
					});
				} else {			
					LoadService.hide();
					
					if(!dev){	
						//navigator.splashscreen.hide();
					}
				}
			});
		},
        cadastrarUsuario: function (novoUsuario, callback) {
            FirebaseFactory.auth().$createUserWithEmailAndPassword(novoUsuario.email, novoUsuario.senha).then(function (userData) {
				FirebaseFactory.auth().$signInWithEmailAndPassword(novoUsuario.email, novoUsuario.senha).then(function (authData) {
					UsuarioFactory.getUsuario(authData.uid, function(){
						UsuarioFactory.setUsuario(userData.uid, 'manual', novoUsuario.nome, novoUsuario.email, novoUsuario.sexo, novoUsuario.email);
						
						callback(null, $rootScope.usuario);					
					});
				}).catch(function (error) {
					if(error.code === 'INVALID_EMAIL'){
						callback("E-mail inválido.");
					} else if(error.code === 'INVALID_USER'){
						callback("Usuário não cadastrado.");
					} else if(error.code === 'INVALID_PASSWORD'){
						callback("Senha inválida.");
					} else {
						callback("Ocorreu um erro ao tentar entrar, tente novamente.");
					} 
				});
            }).catch(function (error) {
                if(error.code === 'INVALID_EMAIL'){
					callback("E-mail inválido.");
				} else if(error.code === 'EMAIL_TAKEN'){
					callback("Usuário já cadastrado.");
				} else {
					callback("Ocorreu um erro ao tentar efetuar cadastro, tente novamente.");
				}
            });
        },
        loginManual: function (email, senha, callback) {
            FirebaseFactory.auth().$signInWithEmailAndPassword(email, senha).then(function (authData) {
                UsuarioFactory.getUsuario(authData.uid, function(){
					UsuarioFactory.setUsuario(authData.uid, 'manual', $rootScope.usuario.nome, authData.email, $rootScope.usuario.sexo, authData.email, $rootScope.usuario.descricao, $rootScope.usuario.img, $rootScope.usuario.visivel, $rootScope.usuario.filtro, $rootScope.usuario.push, $rootScope.usuario.curtidas);
							
                    callback(null, $rootScope.usuario);					
				});
            }).catch(function (error) {
                if(error.code === 'INVALID_EMAIL'){
					callback("E-mail inválido.");
				} else if(error.code === 'INVALID_USER'){
					callback("Usuário não cadastrado.");
				} else if(error.code === 'INVALID_PASSWORD'){
					callback("Senha inválida.");
				} else {
					callback("Ocorreu um erro ao tentar entrar, tente novamente.");
				} 
            });
        },
        loginFacebook: function (callback) {
			facebookConnectPlugin.login(["public_profile", "email", "user_friends"], function (success){
				var credential = firebase.auth.FacebookAuthProvider.credential(success.authResponse.accessToken);
				FirebaseFactory.auth().$signInWithCredential(credential).then(function (authData) {
					facebookConnectPlugin.api(success.authResponse.userID + "/?fields=id,email,gender,picture", [], function (result) {
						UsuarioFactory.getUsuario(authData.uid, function(){
							UsuarioFactory.setUsuario(authData.uid, 'facebook', $rootScope.usuario.nome || authData.displayName, result.email, $rootScope.usuario.sexo || (result.gender == 'male' ? 1 : 2), result.email, $rootScope.usuario.descricao, $rootScope.usuario.img || { src: result.picture.data.url, thumb: result.picture.data.url }, $rootScope.usuario.visivel, $rootScope.usuario.filtro, $rootScope.usuario.push, $rootScope.usuario.curtidas);

							callback(null, $rootScope.usuario);
						});
					}).catch(callbackError);
				}, callbackError);
			}, callbackError);

			var callbackError = function(error){
				alert(1);
				alert(error);
				
				if(error.code === 'USER_CANCELLED'){
					callback("Login cancelado pelo usuário.");
				} else{
					callback("Ocorreu um erro ao tentar entrar com o Facebook, tente novamente.");
				}
			}
        },
		geraNovaSenha: function (usuario, callback) {
			FirebaseFactory.auth().$resetPassword({
				email: usuario.email
			}).then(function() {
			  	callback(null, "Senha gerada com sucesso, por favor verifique seu e-mail.");
			}).catch(function(error) {
			  	if(error.code === 'INVALID_EMAIL'){
					callback("E-mail inválido.");
				} else if(error.code === 'INVALID_USER'){
					callback("Usuário não cadastrado.");
				} else {
					callback("Ocorreu um erro ao tentar gerar uma nova senha, tente novamente.");
				} 
			});
		},
		alteraSenha: function (usuario, callback) {
			FirebaseFactory.auth().$changePassword({
				email: usuario.email,
				oldPassword: usuario.senhaAntiga,
				newPassword: usuario.senhaNova
			}).then(function() {
			  	callback(null, "Senha alterada com sucesso.");
			}).catch(function(error) {
			  	if(error.code === 'INVALID_EMAIL'){
					callback("E-mail inválido.");
				} else if(error.code === 'INVALID_USER'){
					callback("Usuário não cadastrado.");
				} else {
					callback("Ocorreu um erro ao tentar alterar a senha, tente novamente.");
				} 
			});
		},
        on: function (uid) {
            var status = FirebaseFactory.ref().child('.info/connected');

            status.on('value', function (isOnline) {
                if (isOnline.val()) {
                   
                } else {
					//$state.go('offline');
				}
            });
        }
    }
});
app.factory("UsuarioFactory", function (FirebaseFactory, $firebaseObject, $firebaseArray, $rootScope, $cordovaFileTransfer, $cordovaFile, PushService) {
    return {
		setUsuario: function (id, provider, nome, username, sexo, email, descricao, img, visivel, filtro, push) {
        	$rootScope.usuario.id = id;
			$rootScope.usuario.provider = provider;
        	$rootScope.usuario.nome = nome || '';
        	$rootScope.usuario.username = username || '';
        	$rootScope.usuario.sexo = sexo || '';
        	$rootScope.usuario.email = email || '';
			$rootScope.usuario.dtSessao = firebase.database.ServerValue.TIMESTAMP;
        	$rootScope.usuario.dtNascimento = firebase.database.ServerValue.TIMESTAMP;
        	$rootScope.usuario.descricao = descricao || 'Olá!!! ;)';
        	$rootScope.usuario.img = img  || { src: 'img/anonimo.png', thumb: 'img/anonimo.png' };
			$rootScope.usuario.visivel = visivel || true;
			$rootScope.usuario.filtro = filtro || {	estilo: { sertaneja: true, eletronica: true, samba: true, rock: true, rap: true, funk: true }, sexo: { homem: true, mulher: true } };
			$rootScope.usuario.push = push || { ids: { userId: '', pushToken: '' }, habilitado: true, vibrar: true, som: true };
			$rootScope.usuario.ip = '';
			$rootScope.curtidas = $firebaseArray(FirebaseFactory.ref().child("curtidas").child($rootScope.usuario.id));			
    	},
		getUsuario: function(usuarioId, callback){			
			$rootScope.usuario = $firebaseObject(FirebaseFactory.ref().child("users").child(usuarioId));
				
			$rootScope.usuario.$bindTo($rootScope, "usuario").then(function(unbind) {
				$rootScope.unbind = unbind;
			});
			
			$rootScope.usuario.$loaded().then(function(){
				callback();				
			});
		},
        onEmpresa: function (empresaId, usuarioId) {
            var status = FirebaseFactory.ref().child('.info/connected');
            
            status.on('value', function (isOnline) {
                if (isOnline.val()) {
					$rootScope.usuario.balada = empresaId;
                } else {
					$rootScope.usuario.balada = '';
				}
            });
        },
        offEmpresa: function (usuarioId) {
			$rootScope.usuario.balada = '';
		}
    }
});
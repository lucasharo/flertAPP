app.service('ContatosService', function ($rootScope, FirebaseFactory, $firebaseObject, UsuariosService) {
    return {
        getContato: function (contato, callback) {
			var contatoId = contato.$id.replace($rootScope.usuario.id, '');
			
			contato.usuario = UsuariosService.getUsuario(contatoId);
			
			contato.usuario.$loaded().then(function(){
				callback();
			});
        }
    }
});
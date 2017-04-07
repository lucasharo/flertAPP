app.factory("ContatosFactory", function ($rootScope, $firebaseArray, UsuariosService) {
  return $firebaseArray.$extend({
		getContato: function () {
			angular.forEach(this.$list, function(contato) {        
				var contatoId = contato.$id.replace($rootScope.usuario.id, '');
				
				contato.usuario = UsuariosService.getUsuario(contatoId);
			});
        },
	});
});
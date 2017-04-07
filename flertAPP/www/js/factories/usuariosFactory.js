app.factory("UsuariosFactory", function ($rootScope, $firebaseArray, UsuariosService, ChatService) {
  return $firebaseArray.$extend({
		getUltimaMensagem: function () {
			angular.forEach(this.$list, function(usuario) {				
				ChatService.getUltimaMensagem(usuario);
			});
        },
	});
});
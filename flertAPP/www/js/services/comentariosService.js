app.service("ComentariosService", function ($firebaseArray, UsuariosService, FirebaseFactory, $ionicActionSheet, $ionicScrollDelegate) {
    return {
        getComentarios: function (empresaId) {
        	var comentarios = $firebaseArray(FirebaseFactory.ref().child('comentarios').child(empresaId));
			
			return comentarios;
        }
    }
});
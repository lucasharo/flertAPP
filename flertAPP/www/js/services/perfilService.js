app.service("PerfilService", function ($firebaseObject, $firebaseArray, FirebaseFactory) {	
    return {
        getPerfil: function (usuarioId, callback) {
            var usuarioPerfil = $firebaseObject(FirebaseFactory.ref().child('users').child(usuarioId));
            
            usuarioPerfil.$loaded().then(function () {
                callback(usuarioPerfil);
            });
        },		
        getFotos: function (usuarioId, callback) {
            var fotos = $firebaseArray(FirebaseFactory.ref().child('imagens').child(usuarioId));
            
            fotos.$loaded().then(function () {
                callback(fotos);
            });
        }
    }
});
app.factory("PerfilFactory", function ($firebaseObject, $firebaseArray, FirebaseFactory) {
    return {
        getPerfil: function (usuarioId, callback) {
            var usuario = $firebaseObject(FirebaseFactory.ref().child('users').child(usuarioId));
            
            usuario.$loaded().then(function () {
                callback(usuario);
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
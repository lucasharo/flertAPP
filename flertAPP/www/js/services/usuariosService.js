app.service('UsuariosService', function ($localStorage, FirebaseFactory, $firebaseObject, $firebaseArray, EmpresasFactory) {
    return {
        getUsuarios: function (empresaId) {
            return $firebaseArray(FirebaseFactory.ref().child('users').orderByChild('balada').equalTo(empresaId));
        },
        getUsuario: function (usuarioId) {
            return $firebaseObject(FirebaseFactory.ref().child('users').child(usuarioId));
        }
    }
});
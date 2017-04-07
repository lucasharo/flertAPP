app.factory("RedeFactory", function ($firebaseArray, FirebaseFactory) {
    return {
        getUsuarios: function (ip, callback) {
			var usuarios = $firebaseArray(FirebaseFactory.ref().child('users').orderByChild('ip').equalTo(ip));	
			
			callback(usuarios);
        }
    }
});
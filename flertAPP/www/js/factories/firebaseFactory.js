app.factory("FirebaseFactory", function ($firebaseAuth, Config) {	
	firebase.initializeApp(Config.firebase);

    return {
		auth: function(){
			return $firebaseAuth(firebase.auth());
		},
		ref: function(){
			return firebase.database().ref();
		},
		storage: function(){
			return firebase.storage().ref();
		}
	}
});
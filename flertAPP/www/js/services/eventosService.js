app.service("EventosService", function ($firebaseArray, $firebaseObject, FirebaseFactory) {
    return {
		getEvento: function (eventoId, callback) {
            var evento = $firebaseObject(FirebaseFactory.ref().child('eventos').child(eventoId));

			evento.$loaded().then(function(){
				evento.adms = $firebaseArray(FirebaseFactory.ref().child('empresas').child(evento.empresaId).child('adms'));
				
				evento.adms.$loaded().then(function(){
					callback(evento);
				});
			});
        },
        getEventos: function (empresaId) {
        	var eventos = $firebaseArray(FirebaseFactory.ref().child('eventos').orderByChild('empresaId').equalTo(empresaId));
			
			return eventos;
        },
		getUltimosEventos: function (empresaId) {
        	var eventos = $firebaseArray(FirebaseFactory.ref().child('eventos').orderByChild('empresaId').equalTo(empresaId).limitToLast(5));
			
			return eventos;
        },
		getFotos: function (eventoId) {
        	var fotos = $firebaseArray(FirebaseFactory.ref().child('fotos-evento').orderByChild('eventoId').equalTo(eventoId));
			
			return fotos;
        }
    }
});
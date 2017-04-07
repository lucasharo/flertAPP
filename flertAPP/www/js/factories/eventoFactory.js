app.factory("EventoFactory", function ($firebaseArray, FirebaseFactory, $firebaseObject, $rootScope) {
	var empresas = [];	
	
    var getQtdUsuarios = function (empresa, callback) {
		callback = callback || function () { }
		
        var usuarios = $firebaseArray(FirebaseFactory.ref().child('users').orderByChild('balada').equalTo(empresa.$id));
	
		usuarios.$loaded().then(function(){
        	empresa.usuarios = usuarios;
		
			callback(empresa);
		});
    }
	
	var getQtdComentarios = function (empresa, callback) {
		callback = callback || function () { }
		
		var comentarios = $firebaseArray(FirebaseFactory.ref().child('comentarios').child(empresa.$id).child('comentarios'));
	
		comentarios.$loaded().then(function(){
        	empresa.comentarios = comentarios;
		
			callback(empresa);
		});        
    }

    return {
        getEmpresas: function (callback) {			
			empresas = $firebaseArray(FirebaseFactory.ref().child('empresas').orderByChild('qtdCurtidas'));
	
			empresas.$loaded().then(function(){
				callback(empresas);
			});
        },
		getEmpresasCarregadas: function (callback) {
			return empresas;
        },
        getEmpresa: function (empresaId, callback) {
            var empresa = $firebaseObject(FirebaseFactory.ref().child('empresas').child(empresaId));

			empresa.$loaded().then(function(){
				empresa.adms = $firebaseArray(FirebaseFactory.ref().child('empresas').child(empresaId).child('adms'));
				
				empresa.adms.$loaded().then(function(){
					callback(empresa);
				});
			});
        },
		verificaCurtidas: function(){
			if($rootScope.curtidas.length > 0) {
				for(var i = 0; i < empresas.length; i++){
					empresas[i].curti = false;
					
					for(var j = 0; j < $rootScope.curtidas.length; j++){
						if($rootScope.curtidas[j].id === empresas[i].$id){
							empresas[i].curti = true;
							
							break;
						}
					}
				}
			}
		},
		getQtdUsuarios: getQtdUsuarios,
		getQtdComentarios: getQtdComentarios
    }
});
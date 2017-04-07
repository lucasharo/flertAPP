app.service('ChatService', function (FirebaseFactory, $firebaseObject, $firebaseArray, $ionicActionSheet, $rootScope) {
    var COLORS = [
	    '#A52A2A', '#8A2BE2', '#0000FF', '#6495ED', '#DC143C','#FF4500', '#4a0588',
        '#008B8B', '#006400', '#8B008B', '#d07a3b', '#4B0082', '#FF0000', '#380224',
        '#FF1493', '#1E90FF', '#FF69B4', '#FFFF00', '#20B2AA', '#383802', '#021738',
        '#0070ff', '#05c126', '#f5e673'
    ]
	
	var getConversaId = function(usuarioId){
		var conversaId;
	
		if (usuarioId < $rootScope.usuario.id) {
           	conversaId = usuarioId + $rootScope.usuario.id;
        } else {
           	conversaId = $rootScope.usuario.id + usuarioId;
        }
		
		return conversaId;
	}

    return {
        getMensagens: function (conversaId) {
            if (conversaId) {
                var mensagens = $firebaseArray(FirebaseFactory.ref().child('conversas').child(conversaId).child('mensagens').endAt().limitToLast(500));

                return mensagens;
            }
        },
		getMensagensBatepapo: function (conversaId) {
            if (conversaId) {
                var mensagens = $firebaseArray(FirebaseFactory.ref().child('conversasBatepapo').child(conversaId).child('mensagens').endAt().limitToLast(500));

                return mensagens;
            }
        },
		getUltimaMensagem: function(usuario){
			let conversaId = getConversaId(usuario.id);
			
			usuario.escrevendo = $firebaseObject(FirebaseFactory.ref().child('conversas').child(conversaId).child(usuario.id + '-' + 'escrevendo'));
			
			usuario.ultimaMensagem = $firebaseObject(FirebaseFactory.ref().child('conversas').child(conversaId).child('ultimaMensagem'));
			
			/*var mensagem = FirebaseFactory.ref().child('conversas').child(getConversaId(usuario.id)).child('ultimaMensagem');
			
			mensagem.on("child_added", function (snapshot) {
  				var val = snapshot.val();
				
				if(val) {
               		usuario.mensagem = val.mensagem || '';
					usuario.tipo = val.tipo || '';
					usuario.dtMensagem = val.dtMensagem || 1468253368784;
				} else {
					usuario.mensagem = '';
					usuario.tipo = '';
					usuario.dtMensagem = 1468253368784;
				}					
			});*/
			
			
		},
		verificaEscrevendo: function (usuario){
			var ref = FirebaseFactory.ref().child('conversas').child(getConversaId(usuario.id)).child(usuario.id + '-' + 'escrevendo');
			
			ref.on("value", function (snapshot) {
  				var val = snapshot.val();
				
				usuario.escrevendo = val;
			});
		},
        getUsernameColor: function (nome) {
            var hash = 7;
            for (var i = 0; i < nome.length; i++) {
                hash = nome.charCodeAt(i) + (hash << 5) - hash;
            }

            var index = Math.abs(hash % COLORS.length);
            return COLORS[index];
        },
		getConversaId: getConversaId
    }
});
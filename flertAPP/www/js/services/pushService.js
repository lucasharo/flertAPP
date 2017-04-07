app.service('PushService', function($rootScope) {
	var setConfiguracao = function(){
		//window.plugins.OneSignal.enableNotificationsWhenActive(true);
		//window.plugins.OneSignal.enableInAppAlertNotification(false);
		//window.plugins.OneSignal.setSubscription($rootScope.usuario.push.habilitado);
		//window.plugins.OneSignal.enableVibrate($rootScope.usuario.push.vibrar);
		//window.plugins.OneSignal.enableSound($rootScope.usuario.push.vibrar);
		//window.plugins.OneSignal.enableSound(true);
	}
	
    return {
		init: function(){
			window.FirebasePlugin.getToken(function(token) {
				$rootScope.usuario.push.id = token;
				
				window.FirebasePlugin.subscribe("all");
			}, function(error) {
				alert(error);
			});		

			function didReceiveRemoteNotificationCallBack(jsonData) {
        		/*alert("Notification received:\n" + JSON.stringify(jsonData.payload));

				if(jsonData.payload.additionalData.chat){
					$rootScope.chat(jsonData.payload.additionalData.id);
				}else if(jsonData.payload.additionalData.empresa){
					$rootScope.goToEmpresa(jsonData.payload.additionalData.empresa);
				}*/
    		}
			
			function didOpenRemoteNotificationCallBack (jsonData) {
				if(jsonData.notification.payload.additionalData.chat){
					$rootScope.chat(jsonData.notification.payload.additionalData.chat);
				}else if(jsonData.notification.payload.additionalData.empresa){
					$rootScope.goToEmpresa(jsonData.notification.payload.additionalData.empresa);
				}
    		}
			
			$rootScope.$watch(function(){
				return $rootScope.usuario.push;
			}, function(){
				setConfiguracao();
			});
		},
        novaConversa: function(mensagem, userId) {
			window.plugins.OneSignal.postNotification({ headings: {en: 'Você tem um novo Flert ;)'}, contents: {en: mensagem}, data: {chat: mensagem.usuarioId}, include_player_ids: [userId], android_led_color: '886aea'});		
        },
        aceitaConversa: function(mensagem, userId) {  			
			window.plugins.OneSignal.postNotification({ headings: {en: 'Seu Flert respondeu a mensagem'}, contents: {en: mensagem}, data: {chat: mensagem.usuarioId}, include_player_ids: [userId], android_led_color: '886aea'});
        },
		addTopic: function(topic){
			window.FirebasePlugin.subscribe(topic);
		},
		removeTopic: function(topic){
			window.FirebasePlugin.unsubscribe(topic);
		}
    }
})
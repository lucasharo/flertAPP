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
			if(!dev){
				var iosSettings = {};
				iosSettings["kOSSettingsKeyAutoPrompt"] = true;
				iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

				var notificationOpenedCallback = function(result) {
				   alert("Notification opened:\n" + JSON.stringify(jsonData));
				   console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));  
				};

				window.plugins.OneSignal
				  .startInit("4850866d-9c36-4823-93dd-02bd85e59fef")
				  .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
				  .iOSSettings(iosSettings)
				  .handleNotificationOpened(notificationOpenedCallback)
				  .endInit();
				  
				window.plugins.OneSignal.registerForPushNotifications();
				
				window.plugins.OneSignal.getIds(function(ids) {
				  console.log('getIds: ' + JSON.stringify(ids));
				  alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
				  
				  $rootScope.usuario.push.id = ids.userId;
				  $rootScope.usuario.push.token = ids.pushToken;
				});		
				
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
			}
		},
        novaConversa: function(mensagem, userId) {
			if(!dev){
				window.plugins.OneSignal.postNotification({ headings: {en: 'Você tem um novo Flert ;)'}, contents: {en: mensagem}, data: {chat: mensagem.usuarioId}, include_player_ids: [userId], android_led_color: '886aea'});		
			}
		},
        aceitaConversa: function(mensagem, userId) {
			if(!dev){
				window.plugins.OneSignal.postNotification({ headings: {en: 'Seu Flert respondeu a mensagem'}, contents: {en: mensagem}, data: {chat: mensagem.usuarioId}, include_player_ids: [userId], android_led_color: '886aea'});
			}
		},
		addTopic: function(topic){
			if(!dev){
				window.FirebasePlugin.subscribe(topic);
			}
		},
		removeTopic: function(topic){
			if(!dev){
				window.FirebasePlugin.unsubscribe(topic);
			}
		}
    }
})
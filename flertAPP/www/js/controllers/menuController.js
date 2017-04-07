app.controller('MenuController', function ($scope, $rootScope, $ionicHistory, $timeout, FirebaseFactory, PushService, PerfilService, $ionicModal) {
    $scope.sair = function () {
		$rootScope.usuario.ip = '';

        FirebaseFactory.auth().$signOut().then(function(){
			alert('deslogado');

			PushService.deslogado();
		
			$timeout(function () {		
				$rootScope.unbind();
				
				$ionicHistory.clearCache();
				$ionicHistory.clearHistory();
			}, 1500);

			if(!dev){
				if (!AdMob) { return; }
				
				AdMob.hideBanner();
			}
		});
    }
	
	$scope.fotos = [];

	PerfilService.getFotos($rootScope.usuario.id, function (fotos) {		
		$scope.fotos = fotos;
	});
	
	$ionicModal.fromTemplateUrl('templates/modals/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSettings = modal;
    });
	
    $scope.openSettingsModal = function() {
      $scope.modalSettings.show();
    };
	
    $scope.closeSettingsModal = function() {
      $scope.modalSettings.hide();
    };

    $ionicModal.fromTemplateUrl('templates/modals/my_tinder_plus.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalTinderplus = modal;
    });
    $scope.openTinderplusModal = function() {
      $scope.modalTinderplus.show();
    };
    $scope.closeTinderplusModal = function() {
      $scope.modalTinderplus.hide();
    };
});
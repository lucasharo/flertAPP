app.controller('EmpresasController', function ($scope, $ionicHistory, $timeout, $state, $rootScope, EmpresasFactory, UsuarioFactory, PushService, $firebaseArray, FirebaseFactory, ToastService) {
	$scope.init = function(){
		$rootScope.refreshComplete();
		
		$timeout(function () {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
						
			PushService.init();
		}, 1500);
		
		$scope.getEmpresas = function(){		
			EmpresasFactory.getEmpresas(function(empresas){				
				$scope.empresas = empresas;
					
				EmpresasFactory.verificaCurtidas();

				$scope.empresas.$watch(function(){
					EmpresasFactory.verificaCurtidas();
				});
			});
		}
		
		$scope.showFilterBar = function () {
			$ionicFilterBar.show({
				items: $scope.empresas,
				update: function (filteredItems, filterText) {
					$scope.empresas = filteredItems;
				}
			});
		}
		
		$scope.getEmpresas();

		if(!dev){		
			if (AdMob) {			
				AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
				
				AdMob.showInterstitial();
			}
		}

		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.init();
});
app.controller('RedeController', function ($scope, $rootScope, ChatService, RedeFactory, $interval, $ionicFilterBar) {
	$scope.init = function(){
		$rootScope.refreshComplete();		
		
		$scope.show = true;

		var getIp = function(){
			$.getJSON('http://ipv4.myexternalip.com/json', function(data){
				if($rootScope.usuario.ip != data.ip){
					$rootScope.usuario.ip = data.ip;						
				
					RedeFactory.getUsuarios($rootScope.usuario.ip, function(usuarios){
						$scope.show = false;
			
						$scope.usuarios = usuarios;
		
						$scope.usuarios.$watch(function(){
							angular.forEach($scope.usuarios, function(usuario){
								usuario.dtMensagem = 1468253368784;
								usuario.escrevendo = {
									$value: false
								}
								
								ChatService.getUltimaMensagem(usuario);
							});			
						});
					});
				}
			});
		}
		
		$scope.showFilterBar = function () {
			$ionicFilterBar.show({
				items: $scope.usuarios,
				update: function (filteredItems, filterText) {
				$scope.usuarios = filteredItems;
				}
			});
		}

		$interval(function(){
			getIp();
		}, 5000);

		getIp();

		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.init();
});
app.controller('ContatosController', function ($scope, $rootScope,  ChatService, ContatosFactory, ContatosService, FirebaseFactory) {
	$scope.init = function(){
		$rootScope.refreshComplete();
		
		$scope.show = true;
		
		var conversas = FirebaseFactory.ref().child('conversas');
			
		$scope.contatos = new ContatosFactory(conversas.orderByChild($rootScope.usuario.id).equalTo(true));
		$scope.novosContatos = new ContatosFactory(conversas.orderByChild($rootScope.usuario.id).equalTo(false));
		
		$scope.contatos.$watch(function(){
			$scope.contatos.getContato();
		});
		
		$scope.novosContatos.$watch(function(){				
			$scope.novosContatos.getContato();
			
			$scope.show = false;
		});

		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.init();
});
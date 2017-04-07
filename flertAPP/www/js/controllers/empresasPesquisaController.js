app.controller('EmpresasPesquisaController', function ($scope, EmpresasFactory, $stateParams) {
	$scope.filtro = $stateParams.nomeEmpresa;
	
	$scope.empresas = EmpresasFactory.getEmpresasCarregadas();
	
	$scope.limpaFiltro = function(){
		$scope.filtro = '';
	}
});
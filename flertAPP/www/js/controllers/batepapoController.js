app.controller('BatepapoController', function ($scope, $stateParams, $ionicScrollDelegate, $rootScope, ChatService, EmpresasFactory, $ionicActionSheet) {
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 400;
    var focus = true;

    $scope.txtMensagemFocus = false;

    $scope.mensagens = [];

    var getEmpresa = function () {
        $scope.mensagens = ChatService.getMensagensBatepapo($stateParams.empresaId);

        EmpresasFactory.getEmpresa($stateParams.empresaId, function (empresa) {
            $scope.empresa = empresa;
        });

        $scope.mensagens.$watch(function () {
            $ionicScrollDelegate.scrollBottom();
        });
    }

    $scope.enviarMensagem = function (mensagem) {
        if (mensagem) {
            var mensagemJson = {
                mensagem: mensagem,
                dtMensagem: firebase.database.ServerValue.TIMESTAMP,
                tipo: 1,
                cor: ChatService.getUsernameColor($scope.usuario.nome),
                usuarioId: $scope.usuario.id,
                nome: $scope.usuario.nome
            }

            $scope.mensagens.$add(mensagemJson);

            $ionicScrollDelegate.scrollBottom();

            $scope.mensagem = "";
        }
    }
	
	$scope.removeMensagem = function (index, usuarioId) {
		if (usuarioId != $scope.usuario.id) {
            return;
        }
		
        var options = {
           	buttons: [
             		{ text: '<a class="item-icon-left assertive" href="#"><i class="icon ion-close"></i>Remover</a>' }
           	],
           	buttonClicked: function () {
				$scope.mensagens.$remove(index);
				
				return true;
           	}
        }
		
        $ionicActionSheet.show(options);
    }

    getEmpresa();

    $(document).on("blur", "#txtMensagem", function () {
        if (focus) {
            this.focus();
        } else {
            focus = true;
        }
    });

    $(document).on("click", ".focus", function () {
        this.focus();

        focus = false;
    });

    $(document).on("click", "btnEnviar", function () {
        focus = true;
    });
});
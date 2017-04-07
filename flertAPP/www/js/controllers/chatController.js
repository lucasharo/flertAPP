app.controller('ChatController', function ($scope, $stateParams, $ionicScrollDelegate, $ionicNavBarDelegate, $timeout, $rootScope, UsuariosService, FirebaseFactory, $firebaseObject, ChatService, $ionicActionSheet, PushService, $ionicPopover, Giphy) {
    $timeout(function(){
		$ionicNavBarDelegate.align('left');
	}, 100);
	
	var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 400;
    var focus = true;
	
	$scope.gifQuery = '';
	
	var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
			
	$scope.escrevendo = $firebaseObject(FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($stateParams.usuarioId + '-' + 'escrevendo'));
	$scope.aceito = $firebaseObject(FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($rootScope.usuario.id));
	$scope.aceitoUsuarioChat = $firebaseObject(FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($stateParams.usuarioId));

    $scope.txtMensagemFocus = false;

    $scope.mensagens = [];

    var getUsuarioById = function (id) {
        $scope.usuarioChat = UsuariosService.getUsuario(id);

        $scope.mensagens = ChatService.getMensagens($stateParams.conversaId);
		
		$scope.mensagens.$loaded().then(function(){
			_scrollBottom();
		});
		
		$ionicScrollDelegate.scrollBottom();
    }

    $scope.enviaMensagem = function (mensagem, tipo) {		
        if (mensagem) {			
			var mensagemJson = {
				mensagem: mensagem,
				dtMensagem: firebase.database.ServerValue.TIMESTAMP,
				tipo: tipo,
				enviado: false,
				usuarioId: $rootScope.usuario.id
			}
				
			FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($rootScope.usuario.id).set(true);
			
			if($scope.aceito.$value == null){				
				if($scope.aceitoUsuarioChat.$value == null) {
					FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($stateParams.usuarioId).set(false);

					PushService.novaConversa(mensagem, $scope.usuarioChat.push.ids.userId);
				} else if($scope.aceitoUsuarioChat.$value == true) {
					PushService.aceitaConversa(mensagem, $scope.usuarioChat.push.ids.userId);
				}
			}

            $scope.mensagens.$add(mensagemJson).then(function(ref){
				let conversa = FirebaseFactory.ref().child('conversas').child($stateParams.conversaId);
				
				conversa.child('mensagens').child(ref.key).child('enviado').set(true);
				
				conversa.child('ultimaMensagem').set(mensagemJson);				
			});

            $scope.mensagem = '';
			
			if(tipo == 1){
				_scrollBottom();
			}else{
				_scrollBottom('#type-area2');
			}
        }
    }
	
	$scope.fakeReply = function() {
		$timeout(function() {
			var mensagemJson = {
				mensagem: ';););););););););)',
				dtMensagem: firebase.database.ServerValue.TIMESTAMP,
				tipo: 1,
				usuarioId: $scope.usuarioChat.id
			}
			
			$scope.mensagens.$add(mensagemJson);
		  
			_scrollBottom();
		}, 500);
	}

    $scope.removeMensagem = function (index) {
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
	
	$scope.bloqueiaConversa = function(){
		FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($rootScope.usuario.id).set(false);
		
		$scope.popover.hide();
		
		$rootScope.goBack();
	}
	
	$scope.desbloqueiaConversa = function(){
		FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($rootScope.usuario.id).set(true);
	}

    $scope.updateTyping = function () {
        var escrevendo = FirebaseFactory.ref().child('conversas').child($stateParams.conversaId).child($scope.usuario.id + '-' + 'escrevendo');

        if (!typing) {
            typing = true;
            escrevendo.set(true);
        }

        lastTypingTime = (new Date()).getTime();
        $timeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                escrevendo.set(false);
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    }

    $scope.openGiphy = function() {
      $scope.isGifShown = true;
      $scope.mensagem = '';
    }

    var _scrollBottom = function(target) {
      target = target || '#type-area';

      viewScroll.scrollBottom();
      _keepKeyboardOpen(target);
    }

    var _keepKeyboardOpen = function(target) {
      target = target || '#type-area';

      txtInput = angular.element(document.body.querySelector(target));
	  
      txtInput.one('blur', function() {
        txtInput[0].focus();
      });
    }

    $scope.$watch('gifQuery', function(newValue) {
      if (newValue && newValue.length) {
        $scope.isGifLoading = true;
        $scope.gifs = [];

        Giphy.search(newValue)
          .then(function(gifs) {
            $scope.gifs = gifs;
            $scope.isGifLoading = false;
          })
      } else {
        _initGiphy();
      }
    });

    $scope.showUserOptions = function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Mute Notifications' },
          { text: 'Unmatch Max' },
          { text: 'Report Max' },
          { text: 'Show Max\'s profile' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
        },
        buttonClicked: function(index) {
          return true;
        }
      });
    }

    var _initGiphy = function() {
		Giphy.trending().then(function(gifs) {
          $scope.gifs = gifs;
        });
    }	
	
    _initGiphy();

    getUsuarioById($stateParams.usuarioId);	

    /*$(document).on("blur", "#txtMensagem", function () {
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
    });*/
});
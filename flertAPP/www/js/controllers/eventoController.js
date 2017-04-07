app.controller('EventoController', function ($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, $rootScope, $timeout, $filter, UsuariosService, EmpresasFactory, UsuarioFactory, LoadService, ComentariosService, $ionicModal, ChatService, $ionicActionSheet, $firebaseArray, $firebaseStorage, FirebaseFactory, PushService, EventosService, UsuariosFactory, ionicDatePicker, ionicTimePicker, ImagemService, EventosService) {
	$scope.init = function (){
		$rootScope.refreshComplete();

		LoadService.show();
		
		$scope.isAdm = false;
		$scope.curti = false;
		$scope.comentario = "";
		$scope.comentarios = [];
		$scope.eventos = [];
		$scope.evento = {};
		
		$ionicModal.fromTemplateUrl('templates/comentarios-modal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});

		$ionicModal.fromTemplateUrl('templates/modals/add_evento.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.eventoModal = modal;
		});
		
		$scope.removeEvento = function(evento) {
			if($scope.isAdm){
				var options = {
					buttons: [
						{ text: '<a class="item-icon-left assertive" href="#"><i class="icon ion-close"></i>Remover</a>' }
					],
					buttonClicked: function () {
						$scope.eventos.$remove(evento);
					
						return true;
					}
				}
			
				$ionicActionSheet.show(options);
			}
		}
		
		$scope.abrirModalEventos = function(){
			if($scope.eventos.length == 0){
				$scope.eventos = EventosService.getEventos($stateParams.empresaId);
			}

			$scope.eventoModal.show();
			
			$timeout(function(){
				var date = new Date();				
				
				document.getElementById("dia").min = $filter('date')(date, "yyyy-MM-dd");
				
				date.setFullYear(date.getFullYear() + 1);
				
				document.getElementById("dia").max = $filter('date')(date, "yyyy-MM-dd");
			});
		}
		
		var removeFoto = function (time, evento, callback) {
			ImagemService.removeFoto(storageRefSrc, storageRefThumb, function(){
				
			});
		}
		
		var addFotosEvento = function(e, src){
			if (e) {
				ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
			} else {
				LoadService.show();

				ImagemService.getThumbnail(src, function (e, thumb) {
					if (e) {
						LoadService.hide();

						ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
					} else {
						var time = new Date().getTime();
						
						var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child($stateParams.eventoId).child(time + '_src'));
						var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child($stateParams.eventoId).child(time + '_thumb'));
						
						ImagemService.carregarImagem(src, thumb, time, storageRefSrc, storageRefThumb, function(e, img){						
							img.eventoId = $stateParams.eventoId;
							img.usuarioId = $rootScope.usuario.id;
							
							$scope.fotos.$add(img);
							
								//PushService.novoEvento(empresaId, evento, $rootScope.usuario.push.ids.userId);
						});
					}
				});
			}
		}
		
		$scope.addFotosEvento = function () {
			var action = function (index) {
				if (index == 0) {
					ImagemService.camera(addFotosEvento);
				} else {
					ImagemService.galeria(addFotosEvento);
				}
			}

			var buttons = [
				{ text: '<a class="item-icon-left royal font-bold text-u-c" href="#"><i class="icon ion-camera"></i>Camera</a>' },
				{ text: '<a class="item-icon-left accent-3-color font-bold text-u-c" href="#"><i class="icon ion-images"></i>Galeria</a>' }              
			]

			var options = {
				buttons: buttons,
				buttonClicked: function (index) {
					action(index);

					return true;
				}
			}

			$ionicActionSheet.show(options);
		}

		$scope.abrirModalComentarios = function () {
			if($scope.comentarios.length == 0){
				$scope.comentarios = ComentariosService.getComentarios($scope.empresa.$id);
			}
			
			$scope.modal.show();
		}
		
		$scope.enviaComentario = function(comentario){
			if (comentario) {                
				var comentarioJson = {
					comentario: comentario,
					dtComentario: firebase.database.ServerValue.TIMESTAMP,
					usuarioId: $scope.usuario.id,
					nome: $scope.usuario.nome,
					img: $scope.usuario.img.thumb
				}
				
				$scope.comentarios.$add(comentarioJson);
				
				$ionicScrollDelegate.scrollBottom();
				
				return "";
			} else {
				return comentario;
			}
		}
		
		$scope.removeComentario = function (comentario) {		
			var options = {
				buttons: [
					{ text: '<a class="item-icon-left assertive" href="#"><i class="icon ion-close"></i>Remover</a>' }
				],
				buttonClicked: function () {
					$scope.comentarios.$remove(comentario);
				
					return true;
				}
			}
			
			$ionicActionSheet.show(options);
		}
		
		$scope.curtirDescurtir = function(empresaId){
			if($scope.curti){
				for(var i = 0; i < $rootScope.curtidas.length; i++){
					if($rootScope.curtidas[i].id === empresaId){					
						$rootScope.curtidas.$remove(i).then(function(){		
							$scope.curti = false;

							//PushService.removerNotificacaoBalada(empresaId);
						});
						
						break;
					}
				}
			} else{
				$rootScope.curtidas.$add({id: empresaId}).then(function(){		
					$scope.curti = true;

					//PushService.receberNotificacaoBalada(empresaId, true);
				});	
			}
		}

		EventosService.getEvento($stateParams.eventoId, function (evento) {
			$scope.evento = evento;
			
			EmpresasFactory.getEmpresa($stateParams.empresaId, function (empresa) {
				$scope.empresa = empresa;
					
				//for(var i = 0; i < $scope.empresa.adms.length; i++){
				//	if($scope.empresa.adms[i].id == $rootScope.usuario.id){
				//		$scope.isAdm = true;
                //
				//		break;
				//	}
				//}
				
				$scope.ultimosEventos = EventosService.getUltimosEventos($stateParams.empresaId);
			
				$scope.fotos = EventosService.getFotos($stateParams.eventoId);
			
				LoadService.hide();
			});
		});
		
		$scope.$broadcast('scroll.refreshComplete');	
	}

	$scope.init();
});
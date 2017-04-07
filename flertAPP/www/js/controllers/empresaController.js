app.controller('EmpresaController', function ($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, $rootScope, $timeout, $filter, UsuariosService, EmpresasFactory, UsuarioFactory, LoadService, ComentariosService, $ionicModal, ChatService, $ionicActionSheet, $firebaseArray, $firebaseStorage, FirebaseFactory, PushService, EventosService, UsuariosFactory, ionicDatePicker, ionicTimePicker, ImagemService, $cordovaDatePicker) {
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

		$scope.salvarEvento = function(evento){
			if($scope.eventos.length == 0){
				$scope.eventos = EventosService.getEventos($stateParams.empresaId);
			}

			$scope.eventos.$loaded().then(function(){
				var time = new Date().getTime();			
				
				var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child(time + '_src'));
				var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child(time + '_thumb'));
				
				ImagemService.carregarImagem(evento.img.src, evento.img.thumb, time, storageRefSrc, storageRefThumb, function(e, img){
					evento.empresaId = $stateParams.empresaId;
					evento.usuarioId = $rootScope.usuario.id;
					evento.dia = evento.dia.getTime();
					evento.hora = evento.hora.getTime();					
					evento.enviado = false;					
					evento.img = img;
					
					$scope.eventos.$add(evento);
				
					//PushService.novoEvento(empresaId, evento, $rootScope.usuario.push.ids.userId);
				
					$scope.evento = {};
					
					$scope.eventoModal.hide();
				});
			})
		}

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
		
		var carregarImagem = function (src, thumb, time, obj, isEvento, callback) {
			$scope.stopSync = function(){
				LoadService.hide();

				uploadTaskSrc = null;
				uploadTaskThumb = null;
				storageRefSrc = null;
				storageRefThumb = null;
			}

			LoadService.showButton($scope, 'Carregando imagem');
			
			if(isEvento){
				var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child(time + '_src'));
				var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child('eventos').child(time + '_thumb'));
			} else{			
				var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child(time + '_src'));
				var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child(time + '_thumb'));
			}
			
			var callbackError = function(error){
				storageRefSrc.$delete();
				storageRefThumb.$delete();

				LoadService.hide();

				ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
			}

			uploadTaskSrc = storageRefSrc.$putString(src, 'base64', { contentType: "image/jpeg" });
			uploadTaskThumb = storageRefThumb.$putString(thumb, 'base64', { contentType: "image/jpeg" });

			uploadTaskSrc.$complete(function(snapshotSrc){
				uploadTaskThumb.$complete(function(snapshotThumb){
					obj.img = {
						time: time,
						src: snapshotSrc.downloadURL,
						thumb: snapshotThumb.downloadURL
					}

					LoadService.hide();
					
					callback();
				}).$error(callbackError);
			}).$error(callbackError);
		}
		
		var removeFoto = function (time, evento, callback) {
			if(evento){
				var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child('eventos').child($stateParams.empresaId).child(time + '_src'));
				var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child('eventos').child($stateParams.empresaId).child(time + '_thumb'));
			} else{			
				var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child(time + '_src'));
				var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('empresas').child($stateParams.empresaId).child(time + '_thumb'));
			}

			storageRefSrc.$delete().then(function() {
				storageRefThumb.$delete().then(function() {
					callback();
				}).catch(function(error) {
					ToastService.erro('Erro ao tentar remover imagem, tente novamente.');
				});
			}).catch(function(error) {
				ToastService.erro('Erro ao tentar remover imagem, tente novamente.');
			});
		}
		
		$scope.alterarFotoPerfil = function (time) {
			fgPerfil = true;

			var action = function (index) {
				if (index == 0) {
					ImagemService.camera(addImagem);
				} else if (index == 1) {
					ImagemService.galeria(addImagem);
				} else {
					removeFoto(time, false, function() {
						$scope.usuarioPerfil.img = {
							src: 'img/anonimo.png',
							thumb: 'img/anonimo.png'
						}

						$scope.usuarioPerfil.$save();
					});
				}
			}

			var buttons = [
				{ text: '<a class="item-icon-left royal font-bold text-u-c" href="#"><i class="icon ion-camera"></i>Camera</a>' },
				{ text: '<a class="item-icon-left accent-3-color font-bold text-u-c" href="#"><i class="icon ion-images"></i>Galeria</a>' }              
			]

			if($scope.usuarioPerfil.img.time){
				buttons.push({ text: '<a class="item-icon-left assertive font-bold text-u-c" href="#"><i class="icon ion-close"></i>Remover</a>' });
			}

			var options = {
				buttons: buttons,
				buttonClicked: function (index) {
					action(index);

					return true;
				}
			}

			$ionicActionSheet.show(options);
		}
		
		var addImagemEvento = function(e, src){
			if (e) {
				ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
			} else {
				LoadService.show();

				ImagemService.getThumbnail(src, function (e, thumb) {
					if (e) {
						LoadService.hide();

						ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
					} else {						
						$scope.evento.img = {
							time: new Date().getTime(),
							src: src,
							thumb: thumb,
							isBase64: true
						}

						LoadService.hide();
					}					
				});
			}
		}
		
		$scope.addFotoEvento = function () {
			var action = function (index) {
				if (index == 0) {
					ImagemService.camera(addImagemEvento);
				} else {
					ImagemService.galeria(addImagemEvento);
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

		$scope.testeAlert = function(id){
			alert(id);

			$scope.$broadcast('scroll.refreshComplete');
		}

		$scope.teste = function(){
			facebookConnectPlugin.showDialog({
				method: "share",
				picture:'https://www.google.co.jp/logos/doodles/2014/doodle-4-google-2014-japan-winner-5109465267306496.2-hp.png',
				name:'Test Post',
				message:'First photo post',
				caption: 'Testing using phonegap plugin',
				description: 'Posting photo using phonegap facebook plugin'
			}, function (response) {
				console.log(response)
			}, function (response) {
				console.log(response)
			});
		}

		$scope.testeTag2 = function(empresaId){
			console.log($scope.empresa.adms);
			
			$firebaseArray(FirebaseFactory.ref().child('empresas').child(empresaId).child('adms')).$add({id: $rootScope.usuario.id});

			//$scope.empresa.adms.$add($rootScope.usuario.id);
		}

		$scope.abrirModalComentarios = function () {
			if($scope.comentarios.length == 0){
				$scope.comentarios = ComentariosService.getComentarios($scope.empresa.$id);
			}
			
			$scope.modal.show();
		}

		$scope.sairEmpresa = function () {
			UsuarioFactory.offEmpresa($rootScope.usuario.id);
			
			$state.go('menu.tab.empresas');
		}

		EmpresasFactory.getEmpresa($stateParams.empresaId, function (empresa) {
			$scope.empresa = empresa;
			
			empresa.$bindTo($scope, "empresa");
				
			for(var i = 0; i < $scope.empresa.adms.length; i++){
				if($scope.empresa.adms[i].id == $rootScope.usuario.id){
					$scope.isAdm = true;

					break;
				}
			}
			
			$scope.usuarios = new UsuariosFactory(FirebaseFactory.ref().child('users').orderByChild('balada').equalTo($stateParams.empresaId));
		
			$scope.usuarios.$loaded(function(){
				$scope.usuarios.getUltimaMensagem();
			});
			
			$scope.ultimosEventos = EventosService.getUltimosEventos($stateParams.empresaId);
			
			LoadService.hide();
		});
		
		$scope.enviaComentario = function(comentario){
			if (comentario) {                
				var comentarioJson = {
					comentario: comentario,
					dtComentario: firebase.database.ServerValue.TIMESTAMP,
					usuarioId: $rootScope.usuario.id,
					nome: $rootScope.usuario.nome,
					img: $rootScope.usuario.img.thumb
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
		
		var verificaCurtir = function(empresaId){
			for(var i = 0; i < $rootScope.curtidas.length; i++){
				if($rootScope.curtidas[i].id === empresaId){
					$scope.curti = true;
					
					break;
				}
			}
		}
		
		verificaCurtir($stateParams.empresaId);
		
		/*$(document).on("focus", "#txtComentario", function () {
			$('#formComentarios').css("background-color","#000");
		});
		
		$(document).on("blur", "#txtComentario", function () {
			$('#formComentarios').css("background", "transparent");
		});*/
		
		$scope.$broadcast('scroll.refreshComplete');
		
		$timeout(function(){
			//document.getElementById('content-empresa').style.marginTop = document.getElementById('img-empresa').offsetHeight + 'px';
			//document.getElementById('div-img-empresa').style.height = document.getElementById('img-empresa').offsetHeight + 'px';
		});		
	}

	$scope.init();
});
app.controller('PerfilController', function ($scope, $stateParams, $ionicScrollDelegate, $ionicNavBarDelegate, $ionicSlideBoxDelegate, $timeout, $rootScope, ToastService, LoadService, PerfilService, $ionicModal, $ionicActionSheet, ImagemService, FirebaseFactory, $firebaseArray, $firebaseStorage) {
    LoadService.show();

    $scope.init = function () {
        $rootScope.refreshComplete();

        $scope.comentario = "";

        /*$ionicModal.fromTemplateUrl('templates/perfil-modal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});*/

        $scope.slideHasChanged2 = function (index) {
            alert(index);
        }

        $scope.abrirModal = function () {
            $scope.usuarioModal = {
                nome: $scope.usuarioPerfil.nome,
                sexo: $scope.usuarioPerfil.sexo,
                descricao: $scope.usuarioPerfil.descricao
            }

            $scope.modal.show();
        }

        $scope.getNumber = function (qtd) {
            if (isNaN(qtd)) return 0;

            return new Array(Math.ceil(qtd / 6));
        }

        $ionicModal.fromTemplateUrl('templates/modals/fotos-modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.fotosModal = modal;
        });

        $scope.abrirImagemModal = function (index) {
            $ionicSlideBoxDelegate.slide(index);

            $scope.indexFoto = index;

            $scope.fotosModal.show();

            $ionicScrollDelegate.scrollTop();
        }

        $scope.slideHasChanged = function (index) {
            $scope.indexFoto = index;
        }

        $scope.enviaComentario = function (comentario, indexFoto) {
            if (comentario) {
                var comentarioJson = {
                    comentario: comentario,
                    dtComentario: firebase.database.ServerValue.TIMESTAMP,
                    usuarioId: $rootScope.usuario.id,
                    nome: $rootScope.usuario.nome,
                    img: $rootScope.usuario.img.thumb
                }

                var comentarios = $firebaseArray(FirebaseFactory.ref().child('imagens').child($scope.usuarioPerfil.id).child($scope.fotos[indexFoto].$id).child('comentarios'));

                comentarios.$loaded().then(function () {
                    comentarios.$add(comentarioJson);

                    $ionicScrollDelegate.scrollBottom();
                });

                return "";
            } else {
                return comentario;
            }
        }

        var removeFoto = function (time, callback) {
            var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('usuarios').child($stateParams.usuarioId).child(time + '_src'));
            var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('usuarios').child($stateParams.usuarioId).child(time + '_thumb'));

            storageRefSrc.$delete().then(function () {
                storageRefThumb.$delete().then(function () {
                    callback();
                }).catch(function (error) {
                    ToastService.erro('Erro ao tentar remover imagem, tente novamente.');
                });
            }).catch(function (error) {
                ToastService.erro('Erro ao tentar remover imagem, tente novamente.');
            });
        }

        $scope.removeFoto = function (index, time) {
            if ($scope.usuarioPerfil.id != $rootScope.usuario.id) {
                return;
            }

            var options = {
                buttons: [
						{ text: '<a class="item-icon-left assertive font-bold text-u-c" href="#"><i class="icon ion-close"></i>Remover</a>' }
                ],
                buttonClicked: function () {
                    removeFoto(time, function () {
                        $scope.fotos.$remove(index);
                    });

                    return true;
                }
            }

            $ionicActionSheet.show(options);
        }

        $scope.removeComentario = function (indexComentario, indexFoto) {
            var options = {
                buttons: [
                    { text: '<a class="item-icon-left assertive font-bold text-u-c" href="#"><i class="icon ion-close"></i>Remover</a>' }
                ],
                buttonClicked: function () {
                    var comentarios = $firebaseArray(FirebaseFactory.ref().child('imagens').child($scope.usuarioPerfil.id).child($scope.fotos[indexFoto].$id).child('comentarios'));

                    comentarios.$loaded().then(function () {
                        comentarios.$remove(indexComentario);
                    });

                    return true;
                }
            }

            $ionicActionSheet.show(options);
        }

        var getUsuarioById = function (usuarioId) {
            PerfilService.getPerfil(usuarioId, function (usuario) {
                $scope.usuarioPerfil = usuario;

                LoadService.hide();

                $rootScope.$broadcast('scroll.refreshComplete');

                $scope.fotos = [];

                $scope.show = true;

                PerfilService.getFotos(usuarioId, function (fotos) {
                    $scope.show = false;

                    $scope.fotos = fotos;

                    $scope.fotos.$watch(function () {
                        $ionicSlideBoxDelegate.update();
                    });

                    $ionicSlideBoxDelegate.update();
                });
            });
        }

        $scope.salvar = function (usuario) {
            $scope.usuarioPerfil.nome = usuario.nome;
            $scope.usuarioPerfil.sexo = usuario.sexo;
            $scope.usuarioPerfil.descricao = usuario.descricao;

            $scope.usuarioPerfil.$save();

            $scope.editProfileModal.hide();
        }

        var fgPerfil = false;
        var uploadTaskSrc;
        var uploadTaskThumb;
        var storageRefSrc;
        var storageRefThumb;

        var addImagem = function (e, src) {
            if (e) {
                ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
            } else {
                $scope.stopSync = function () {
                    LoadService.hide();

                    uploadTaskSrc = null;
                    uploadTaskThumb = null;
                    storageRefSrc = null;
                    storageRefThumb = null;
                }

                LoadService.showButton($scope, 'Carregando imagem');

                ImagemService.getThumbnail(src, function (e, thumb) {
                    if (e) {
                        LoadService.hide();

                        ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
                    } else {
                        var time = new Date().getTime();

                        var storageRefSrc = $firebaseStorage(FirebaseFactory.storage().child('usuarios').child($stateParams.usuarioId).child(time + '_src'));
                        var storageRefThumb = $firebaseStorage(FirebaseFactory.storage().child('usuarios').child($stateParams.usuarioId).child(time + '_thumb'));

                        var callbackError = function (error) {
                            alert(error);

                            storageRefSrc.$delete();
                            storageRefThumb.$delete();

                            LoadService.hide();

                            ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
                        }

                        uploadTaskSrc = storageRefSrc.$putString(src, 'base64', { contentType: "image/jpeg" });
                        uploadTaskThumb = storageRefThumb.$putString(thumb, 'base64', { contentType: "image/jpeg" });

                        uploadTaskSrc.$complete(function (snapshotSrc) {
                            uploadTaskThumb.$complete(function (snapshotThumb) {
                                if (fgPerfil) {
                                    $scope.usuarioPerfil.img = {
                                        time: time,
                                        src: snapshotSrc.downloadURL,
                                        thumb: snapshotThumb.downloadURL
                                    }

                                    $scope.usuarioPerfil.$save();
                                } else {
                                    $scope.fotos.$add({
                                        time: time,
                                        src: snapshotSrc.downloadURL,
                                        thumb: snapshotThumb.downloadURL
                                    });
                                }

                                LoadService.hide();
                            }, callbackError);
                        }, callbackError);
                    }
                });
            }
        }

        $scope.addImagemGaleria = function () {
            if ($scope.fotos.length < 16) {
                fgPerfil = false;

                ImagemService.galeria(addImagem);
            }
            //ImagemService.imagePicker(function (e, fotos) {
            //    if (e) {
            //        ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
            //    } else {
            //        angular.forEach(fotos, function (src) {
            //            ImagemService.getThumbnail(src, function (e, thumb) {
            //                if (e) {
            //                    ToastService.erro('Erro ao tentar adicionar imagem, tente novamente.');
            //                } else {
            //                    $scope.fotos.$add({
            //                        src: src,
            //                        thumb: thumb
            //                    });
            //                }
            //            });
            //        });
            //    }
            //});
        }

        $scope.addImagemCamera = function () {
            if ($scope.fotos.length < 16) {
                fgPerfil = false;

                ImagemService.camera(addImagem);
            }
        }

        $scope.addImagem = function () {
            fgPerfil = false;

            var buttons = [
				{ text: '<a class="item-icon-left royal font-bold text-u-c" href="#"><i class="icon ion-camera"></i>Camera</a>' },
				{ text: '<a class="item-icon-left accent-3-color font-bold text-u-c" href="#"><i class="icon ion-images"></i>Galeria</a>' }
            ]

            var options = {
                buttons: buttons,
                buttonClicked: function (index) {
                    if (index == 0) {
                        ImagemService.camera(addImagem);
                    } else if (index == 1) {
                        ImagemService.galeria(addImagem);
                    }

                    return true;
                }
            }

            $ionicActionSheet.show(options);
        }

        $scope.alterarFotoPerfil = function (time) {
            fgPerfil = true;

            var buttons = [
				{ text: '<a class="item-icon-left royal font-bold text-u-c" href="#"><i class="icon ion-camera"></i>Camera</a>' },
				{ text: '<a class="item-icon-left accent-3-color font-bold text-u-c" href="#"><i class="icon ion-images"></i>Galeria</a>' }
            ]

            if ($scope.usuarioPerfil.img.time) {
                buttons.push({ text: '<a class="item-icon-left assertive font-bold text-u-c" href="#"><i class="icon ion-close"></i>Remover</a>' });
            }

            var options = {
                buttons: buttons,
                buttonClicked: function (index) {
                    if (index == 0) {
                        ImagemService.camera(addImagem);
                    } else if (index == 1) {
                        ImagemService.galeria(addImagem);
                    } else {
                        removeFoto(time, function () {
                            $scope.usuarioPerfil.img = {
                                src: 'img/anonimo.png',
                                thumb: 'img/anonimo.png'
                            }

                            $scope.usuarioPerfil.$save();
                        });
                    }

                    return true;
                }
            }

            $ionicActionSheet.show(options);
        }

        $ionicModal.fromTemplateUrl('templates/modals/settings.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalSettings = modal;
        });

        $scope.openSettingsModal = function () {
            $scope.modalSettings.show();
        };

        $scope.closeSettingsModal = function () {
            $scope.modalSettings.hide();
        };

        $ionicModal.fromTemplateUrl('templates/modals/my_tinder_plus.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalTinderplus = modal;
        });
        $scope.openTinderplusModal = function () {
            $scope.modalTinderplus.show();
        };
        $scope.closeTinderplusModal = function () {
            $scope.modalTinderplus.hide();
        };

        $ionicModal.fromTemplateUrl('templates/modals/profile_edit.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.editProfileModal = modal;
        });

        $scope.usuarioModal = {}

        $scope.openEditProfileModal = function () {
            $scope.usuarioModal = {
                nome: $scope.usuarioPerfil.nome,
                sexo: $scope.usuarioPerfil.sexo,
                descricao: $scope.usuarioPerfil.descricao
            }

            $scope.editProfileModal.show();
        }

        $scope.closeEditProfileModal = function () {
            $scope.editProfileModal.hide();
        };

        /*	$(document).on("focus", "#txtComentario", function () {
			$('#formComentariosFoto').css("background-color","#000");
		});
		
		$(document).on("blur", "#txtComentario", function () {
		$('#formComentariosFoto').css("background", "transparent");
		});*/

        getUsuarioById($stateParams.usuarioId);
    }

    $scope.init();
});
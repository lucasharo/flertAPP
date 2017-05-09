// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var dev = true;

var app = angular.module('app', [
  'ionic',
  'ionic.contrib.ui.tinderCards',
  'ionic.giphy',
  'angular-preload-image',
  'firebase',
  'ngCordova',
  'ngStorage',
  'ion-sticky', 
  'toastr', 
  'ui.utils.masks',
  'ion-cool-profile',
  'ionic-datepicker',
  'ionic-timepicker',
  'ion-floating-menu'
])

.run(function($ionicPlatform, $rootScope, $state, $ionicHistory, $timeout, $location, PushService, UsuarioFactory, ChatService, FirebaseFactory, $cordovaDevice) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);
		  $ionicConfigProvider.scrolling.jsScrolling(false);
		}
		
		/*if(device && device.platform != 'browser'){
			dev = false;
		}*/
	
		$rootScope.location = $location;
	
        $rootScope.goBack = function () {
            $ionicHistory.goBack();
        }
		
        $rootScope.goTo = function (location) {
            $state.go(location);
        }

		$rootScope.goToPerfil = function (id) {
			$state.go('home.perfil', { usuarioId: id });
		}

    	$rootScope.goToEmpresa = function (empresaId) {
        	UsuarioFactory.onEmpresa(empresaId, $rootScope.usuario.id);
		
			$state.go('home.empresa', {empresaId: empresaId});
    	}        
 	
		$rootScope.goToChat = function (usuarioId) {
			if(usuarioId != $rootScope.usuario.id){
        		$state.go('home.messaging', { conversaId: ChatService.getConversaId(usuarioId), usuarioId: usuarioId });
				
				return true;
			} else {
				return false;
			}
    	}

		$rootScope.refreshComplete = function(){
			$timeout(function(){
				$rootScope.$broadcast('scroll.refreshComplete');
			}, 10000);
		}

		var status = FirebaseFactory.ref().child('.info/connected');
        status.on('value', function (isOnline) {
            if (isOnline.val()) {
				if($rootScope.location.$$path == "/offline"){
               		//$ionicHistory.goBack();
				}
            } else {
				//alert($rootScope.location.$$path);
				//$state.go('offline');
			}
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
       		if (toState.url == '/empresas' || toState.url == '/login') {
				UsuarioFactory.offEmpresa($rootScope.usuario.id);
            }
        });

       	$rootScope.admobid = {};

        if (/(android)/i.test(navigator.userAgent)) {
            $rootScope.admobid = { // for Android
                banner: 'ca-app-pub-6027715408427835/6851500501',
                interstitial: 'ca-app-pub-6027715408427835/6851500501'
            };
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            $rootScope.admobid = { // for iOS
                banner: 'ca-app-pub-6027715408427835/6851500501',
                interstitial: 'ca-app-pub-6027715408427835/6851500501'
            };
        } else {
            $rootScope.admobid = { // for Windows Phone
                banner: 'ca-app-pub-6027715408427835/6851500501',
                interstitial: 'ca-app-pub-6027715408427835/6851500501'
            };
        }

		if(!dev){			
			if (!AdMob) { return; }
			
			AdMob.createBanner({
				adId: $rootScope.admobid.banner,
				position: AdMob.AD_POSITION.BOTTOM_CENTER,
				isTesting: true,
				overlap: false,
				offsetTopBar: false,
				bgColor: 'black',
				autoShow: false
			});
			
			AdMob.prepareInterstitial({
				adId: $rootScope.admobid.interstitial,
				isTesting: true,
				autoShow: false
			});			
		}
	});
})

.config(function($ionicConfigProvider, toastrConfig, ionicDatePickerProvider, ionicTimePickerProvider) {
	$ionicConfigProvider.navBar.alignTitle('center');
	$ionicConfigProvider.views.swipeBackEnabled(false); 
	
	angular.extend(toastrConfig, {
	    containerId: 'toast-container',
	    maxOpened: 0,
	    positionClass: 'toast-bottom-full-width',
	    progressBar: false,
	    preventDuplicates: false,
	    preventOpenDuplicates: false
	});
  
	var dateTo = new Date();
	dateTo.setFullYear(dateTo.getFullYear() + 2);
  
	var datePickerObj = {
		inputDate: new Date(),
		setLabel: 'Ok',
		todayLabel: 'Hoje',
		closeLabel: 'Fehar',
		mondayFirst: false,
		weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
		monthsList: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		templateType: 'modal',
		from: new Date(),
		to: dateTo,
		showTodayButton: true,
		dateFormat: 'dd MMMM yyyy',
		closeOnSelect: false
    }
	
    ionicDatePickerProvider.configDatePicker(datePickerObj);
	
	var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 24,
      step: 1,
      setLabel: 'Ok',
      closeLabel: 'Fechar'
    };
	
    ionicTimePickerProvider.configTimePicker(timePickerObj);
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/welcome');

  $stateProvider
    .state('welcome', {
		url: '/welcome',
		templateUrl: 'templates/welcome/welcome.html',
		controller: 'LoginController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
				return FirebaseFactory.auth().$waitForSignIn();
            }]
        }
    })
    .state('home', {
		url: '/home',
		abstract: true,
		templateUrl: 'templates/home/index.html',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })

    .state('home.explore', {
		url: '/explore',
		templateUrl: 'templates/home/explore.html',
		controller: 'EmpresasController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })
	
	.state('home.empresa', {
		url: '/empresa/:empresaId',
		templateUrl: 'templates/home/empresa.html',
		controller: 'EmpresaController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })
	
	.state('home.evento', {
		url: '/evento/:empresaId/:eventoId',
		templateUrl: 'templates/home/evento.html',
		controller: 'EventoController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })

    .state('home.settings', {
		url: '/settings',
		templateUrl: 'templates/home/settings.html',
		controller: 'MenuController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })
	
	.state('home.perfil', {
		url: '/perfil/:usuarioId',
		templateUrl: 'templates/home/perfil.html',
		controller: 'PerfilController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })

    .state('home.matches', {
		url: '/matches',
		templateUrl: 'templates/home/matches.html',
		controller: 'ContatosController',
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    })

    .state('home.messaging', {
		url: '/messaging/:conversaId',
		templateUrl: 'templates/home/messaging.html',
		controller: 'ChatController',
        params: {
            usuarioId: null
        },
        resolve: {
            "currentAuth": ["FirebaseFactory", function (FirebaseFactory) {
                return FirebaseFactory.auth().$requireSignIn();
            }]
        }
    });
});

app.service('LoadService', function ($ionicLoading) {
    return {
        show: function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-royal"></ion-spinner>',
                animation: 'fade-out',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
        },
		showButton: function (scope, text) {            
			$ionicLoading.show({
               template: '<ion-spinner class="spinner-royal"></ion-spinner><br /><br /><p>' + text + '</p><div class="spacer" style="height: 10px;"></div><button class="button button-block button-assertive button-outline" ng-click="stopSync()">Cancelar</button></div>',
               scope: scope
            });
        },
        hide: function () {
            $ionicLoading.hide();
        }
    }
});
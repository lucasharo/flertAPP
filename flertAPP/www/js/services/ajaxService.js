app.service('AjaxService', function ($http, Default, $q, Log, toastr) {
    var timeout = {
        timeout: 120000
    }

    return {
        post: function (url, data) {
            var deferred = $q.defer();

            $http.post(url, data, timeout).then(function (resultado) {
                deferred.resolve(resultado.data);
            }, function (erro) {
                if (erro.status == 404) {
                    erro.data.mensagem = "Erro ao realizar comunicação com o servidor.";
                }
                else if (erro.status == -1) {
                    erro.data = { mensagem: "Erro ao realizar comunicação com o servidor, verifique sua conexão com a internet." };
                }

                deferred.reject(erro.data.mensagem);
            });

            return deferred.promise;
        },
        get: function (url) {
            var deferred = $q.defer();

            $http.get(url, timeout).then(function (resultado) {
                deferred.resolve(resultado.data);
            }, function (erro) {
                if (erro.status == 404) {
                    erro.data.mensagem = "Erro ao realizar comunicação com o servidor.";
                }
                else if (erro.status == -1) {
                    erro.data = { mensagem: "Erro ao realizar comunicação com o servidor, verifique sua conexão com a internet." };
                }

                deferred.reject(erro.data.mensagem);
            });

            return deferred.promise;
        }
    }
})
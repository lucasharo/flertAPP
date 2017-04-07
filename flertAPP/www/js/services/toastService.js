app.service('ToastService', function(toastr) {		
    return{
        sucesso: function(mensagem) {
			toastr.clear();
			
			toastr.success(mensagem);			
        },
		aviso: function(mensagem) {
			toastr.clear();
			
			toastr.warning(mensagem);
        },
        erro: function(mensagem) {
			toastr.clear();
			
			toastr.error(mensagem);
        }
    }
})
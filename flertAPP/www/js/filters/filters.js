app.filter('telefone', function() {
  return function(telefone) {	  
      if(telefone.length > 10){
          return "(" + telefone.substring(0, 2) + ") " + telefone.substring(2, 7) + "-" + telefone.substring(7);
      }else{
          return "(" + telefone.substring(0, 2) + ") " + telefone.substring(2, 6) + "-" + telefone.substring(6);
      }
  }
})

.filter('tipoTelefone', function() {
  return function(tipoTelefone) {               
		if(tipoTelefone == 1){
		    return "Comercial";
		}else if(tipoTelefone == 2){
		    return "Celular";
		}else{
		    return "Residencial";
		}
  }
})

.filter('sexo', function() {
  return function(sexo) {               
		if(sexo == 1){
		    return "Masculino";
		}else{
		    return "Feminino";
		}
  }
})

.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        return input.split(splitChar)[splitIndex];
    }
});
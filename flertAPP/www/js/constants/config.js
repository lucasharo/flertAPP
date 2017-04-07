app.constant('Config', {
    urls: {
        api: 'https://flertapi.mybluemix.net/',
        //api: '192.168.1.108:3000',
		//api: '192.168.100.88:3000',
		//api: '192.168.100.94:3000',
		urlFirebase: 'https://flertapp.firebaseio.com/'
    },
	firebase: {
		apiKey: "AIzaSyApO3vzDtMhQD8BNOVnRS_e2mVfdqk0Dzg",
		authDomain: "flertapp.firebaseapp.com",
		databaseURL: "https://flertapp.firebaseio.com",
		storageBucket: "firebase-flertapp.appspot.com",
		messagingSenderId: "901633122998"
	},
    db: {
        nameDB: 'flertapp.db',
        tables: [
            {
                name: 'usuario',
                columns: [
                    { name: 'username', type: 'text' },
                    { name: 'nome', type: 'text' },
                    { name: 'dtNascimento', type: 'datetime' },
                    { name: 'sexo', type: 'text' },
                    { name: 'img', type: 'text' }
                ]
            },
            {
                name: 'mensagem',
                columns: [
                    { name: 'username', type: 'text' },
                    { name: 'mensagem', type: 'text' },
                    { name: 'dtMensagem', type: 'datetime' },
                    { name: 'tipo', type: 'integer' },
                    { name: 'minhaMensagem', type: 'boolean' }
                ]
            }
        ]
    },
    columns: {
        mensagem: ['username', 'mensagem', 'dtMensagem', 'tipo', 'minhaMensagem'],
        usuario: ['username', 'nome', 'dtNascimento', 'sexo', 'img']
    },
    queries: {
        mensagensByUsername: "select * from mensagem where username = ?",
        ultimaMensagem: "select mensagem from mensagem where username = ? order by dtMensagem desc limit 1"
    }
});
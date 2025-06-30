const loginForm = document.querySelector('.authForm');
const loginPassword = document.querySelector('.authInputPassword');
const loginEmail = document.querySelector('.authInputEmail');

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    if(loginEmail.value.trim() && loginPassword.value.trim()) {
            const formData = new FormData(loginForm);

        fetch( 'https://shfe-diplom.neto-server.ru/login' ,{
            method: 'POST',
            body: formData
        })
        .then( response => response.json())
        .then( function(data){
            if(data.success === true){
                document.location="./index-admin.html"
            } else {
                alert("Неверный логин/пароль!")
            }
        });
    }
});


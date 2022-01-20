import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';


createApp({
    data: function () {
        return {
            url         : 'https://vue3-course-api.hexschool.io/v2',    // 請加入站點
            path        : 'a-hsien', // 請加入個人 API Path
            loginUser   : { username: '' , password: '' }, 
            token       : '',
            tokenName   : 'hexApiToken',
            warning     : '',
            btnText     : 'Login',
        };
    },
    methods: {
        clickLogin(){
            this.btnText = 'connecting...';
            if( this.loginUser.username === '' || this.loginUser.password === '' ){ // 如果欄位是空值
                this.warning = 'Neither of the text fields can be blank!'
                this.btnText = 'Login';
            }else{
                axios.post( `${this.url}/admin/signin` , this.loginUser )
                    .then( response => {
                        this.btnText = 'Login';
                        const { token , expired } = response.data;
    
                        document.cookie = `${ this.tokenName }=${ token }; expires=${ new Date(expired) }; path=/;`;   
                        // 把 token 存到網頁 cookie
                        this.token = token;
                        axios.defaults.headers.common['Authorization'] = token; // 把 token 存在 headers
                        location.href = './products.html';    // 前往下一頁
                    }).catch( error => {
                        const errorMessage = error?.response?.data?.error;

                        if( errorMessage.code === 'auth/invalid-email' ){
                            this.warning = '登入失敗! Email 格式錯誤';
                        }else if( errorMessage.code === 'auth/user-not-found' ){
                            this.warning = '登入失敗! 查無此帳號';
                        }else if( errorMessage.code === 'auth/wrong-password' ){
                            this.warning = '登入失敗! 密碼不正確，請再重新輸入一次';
                        }else if( errorMessage.code === 'auth/too-many-requests' ){
                            this.warning = '登入失敗! 嘗試登入失敗次數過多，目前無法再登入，請稍後再回來';
                        }
                        this.btnText = 'Login';
                    });
            }
        },
        focusInput(){
            this.warning = '';
        },
    },
    created(){ 
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexApiToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }
}).mount("#app");
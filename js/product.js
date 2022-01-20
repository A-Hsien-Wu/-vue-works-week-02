import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

createApp({
    data: function () {
        return {
            url         : 'https://vue3-course-api.hexschool.io/v2',    // 請加入站點
            path        : 'a-hsien', // 請加入個人 API Path
            token       : '',
            tokenName   : 'hexApiToken',
            products    : [],
            currentItem : {},
            timer       : null,
        };
    },
    methods: {
        getItem(item) {
            this.currentItem = Object.assign({}, {
                ...item,
                slider: [item.imageUrl, ...item.imagesUrl],
            });
            this.runSlider(this.currentItem.slider);
        },
        runSlider(imgArr) {
            clearInterval(this.timer);
            let counter = 0;
            const length = this.currentItem.slider.length;
            this.timer = setInterval(() => {
                counter++;
                this.currentItem.imageUrl = this.currentItem.slider[counter % length];
            }, 2000);
        },
        getProducts(){
            axios.get( `${this.url}/api/${ this.path }/admin/products` ).then( response => {
                this.products = [ ...response.data.products ];
            }).catch( error => {
                location.href = './index.html';
            });
        },
    },
    created(){ 
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexApiToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = this.token;
        this.getProducts();
    }
}).mount("#app");



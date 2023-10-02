
const cart = new Vue({
    el: '#cart_app',
    data: {
        lessonsList: [],
        shopingCart: [],
        message: '',
        userPhoneNr: '',
        userName: ''
    },

    created: function() {
        const cartLocalStore = localStorage.getItem('cartItems');
        
        if(cartLocalStore != null) {
            this.shopingCart = [],
            this.shopingCart = JSON.parse(cartLocalStore);
        }
    },

    computed: {
        activeCheckout: function() {
            if(this.userName != '' && this.userPhoneNr != '' && this.shopingCart.length != 0) {
                return true;
            }
            return false;
        }
    },

    methods: {
        removeItem: function(idx, id) {
            this.shopingCart.splice(idx, 1);

            localStorage.setItem('cartItems', JSON.stringify(this.shopingCart));


            const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');
            this.lessonsList = JSON.parse(lessonsStoreLocal);
            

            this.lessonsList.map(lesson => { 
                if(lesson.id == id && lesson.spaces < 5)  {
                    lesson.spaces++;
                }
            });

            localStorage.setItem('lessonsStoreLocal', JSON.stringify(this.lessonsList));

            
        },

        goToLessons: function() {
            window.location = '../html/lessons.html';
        },

        sendOrder: function() {
            this.message = 'Order Succes! Thank you for your order ' + this.userName;
            this.userName = '';
            this.userPhoneNr = '';
            //Empty shoping cart? Not required

            setTimeout(() => {
                this.message = '';
            }, 3000)
        },

        isNumber: function(event) {
            if (!/\d+/.test(event.key) )
                return event.preventDefault();
        },

        isLetter: function(event) {
            if (!/[A-Za-z]+/.test(event.key) )
                return event.preventDefault();
        },

    }
})
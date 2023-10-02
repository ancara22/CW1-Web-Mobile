
const cart = new Vue({
    el: '#cart_app',
    data: {
        lessonsList: [],
        shopingCart: [],
        message: '',
        activeCheckout: false
    },

    created: function() {
        const cartLocalStore = localStorage.getItem('cartItems');
        
        if(cartLocalStore != null) {
            this.shopingCart = [],
            this.shopingCart = JSON.parse(cartLocalStore);
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
        }
    }
})
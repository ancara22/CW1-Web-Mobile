

const lessons_app = new Vue({
    el: '#lessons_app',
    data: {
        lessonsList: [],
        shopingCart: [],
        cartSize: 0
    },

    created: function() {
        fetch('../lessons.json')
            .then(response => response.json())
            .then(data => {
                const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');
        
                if(lessonsStoreLocal == null) {
                    localStorage.setItem('lessonsStoreLocal', JSON.stringify(data));
                    this.lessonsList = data;
                } else {
                    this.lessonsList = JSON.parse(lessonsStoreLocal);
                }

            }).catch(error => {
                console.error('Error loading data:', error);
            });

        const cartLocalStore = localStorage.getItem('cartItems');

        if(cartLocalStore != null) {
            this.shopingCart = [],
            this.shopingCart = JSON.parse(cartLocalStore);
            this.cartSize = this.shopingCart.length;
        }
        

    },

    methods: {
        goToCart: function() {
            window.location = '../html/cart.html';
        },

        addToCart: function(id) {
            let item = this.lessonsList.filter(lesson => { 
                    if(lesson.id == id && lesson.spaces > 0)  {
                        lesson.spaces--;
                        return lesson;
                    }
            });

            if(item.length > 0) {
                this.shopingCart.push(...item);
                this.cartSize++;
                localStorage.setItem('cartItems', JSON.stringify(this.shopingCart));
            }


            const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');

            if(lessonsStoreLocal != null) {
                localStorage.setItem('lessonsStoreLocal', JSON.stringify(this.lessonsList));
            } 

                
        },

        isDisable: function(spaces) {
            return spaces == 0;
        }
    }
});


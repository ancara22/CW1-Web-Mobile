

const lessons_app = new Vue({
    el: '#lessons_app',
    data: {
        fetchedData: [],
        searchedData: [],
        shopingCart: [],
        cartSize: 0,
        sortBy: 'subject',
        sortDirection: 'asc',
        searchValue: '',
    },

    computed: {
        sortedList: function() {
            return this.searchedData.sort((a, b) => {
                if(this.sortBy == 'price') {
                    a['price'] = parseInt(a['price'], 10);
                    b['price'] = parseInt(b['price'], 10);
                }

                if(this.sortDirection == 'asc') {
                    if(a[this.sortBy] > b[this.sortBy]) {
                        return 1;
                    } 
                        return -1;
                } else if(this.sortDirection == 'desc') {
                    if(a[this.sortBy] < b[this.sortBy]) {
                        return 1;
                    } 
                        return -1;
                }

           })

        },

        
    },

    created: function() {
        this.fetchData();
        console.log('first', this.fetchedData)
        console.log('first', this.searchedData)
    },

    methods: {
        goToCart: function() {
            window.location = '../html/cart.html';
        },

        addToCart: function(id) {
            let item = this.fetchedData.filter(lesson => { 
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
                localStorage.setItem('lessonsStoreLocal', JSON.stringify(this.fetchedData));
            } 

                
        },

        isDisable: function(spaces) {
            return spaces == 0;
        },

        

        fetchData: function() {
            fetch('../lessons.json')
                .then(response => response.json())
                .then(data => {
                    const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');
            
                    if(lessonsStoreLocal == null) {
                        localStorage.setItem('lessonsStoreLocal', JSON.stringify(data));
                        this.fetchedData = data;
                        this.searchLesson();
                    } else {
                        this.fetchedData = JSON.parse(lessonsStoreLocal);
                        this.searchLesson();
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
        }
    }
});


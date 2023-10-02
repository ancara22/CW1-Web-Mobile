
//Lessons page Vue application
const lessons_app = new Vue({
    el: '#lessons_app',
    data: {
        fetchedData: [],    //Fetched data from Json file
        searchedData: [],   //Sorted data and filtered by search input. Render content
        shopingCart: [],    //Shoping cart clist
        cartSize: 0,        //Number of items in the cart
        sortBy: 'subject',  //Sort by. subject-default
        sortDirection: 'asc',   //Sort direction. ASC-default
        searchValue: '',        //Searche input value
    },

    computed: {
        //Sort the Rendered list
        sortedList: function() {
            return this.searchedData.sort((a, b) => {
                //If sort by Price, convert data to Int
                if(this.sortBy == 'price') {
                    a['price'] = parseInt(a['price'], 10);
                    b['price'] = parseInt(b['price'], 10);
                }

                //Set ASC or DESC
                if(this.sortDirection == 'asc') {
                    return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
                } else if(this.sortDirection == 'desc') {
                    return a[this.sortBy] < b[this.sortBy] ? 1: -1;
                }
           })
        } 
    },

    created: function() {
        //Fetch the data from JSON file on page open
        this.fetchData();
    },

    methods: {
        //Event handler, on click go to Cart page
        goToCart: function() {
            window.location = './cart.html';
        },

        //Event handler, on button click add the item to shopping cart
        addToCart: function(id) {
            //Find the lesson by ID and update the spaces
            let item = this.fetchedData.filter(lesson => { 
                    if(lesson.id == id && lesson.spaces > 0)  {
                        lesson.spaces--;
                        return lesson;
                    }
            });

            //Add the item to shopping Cart Array, update the cart size
            if(item.length > 0) {
                this.shopingCart.push(...item);
                this.cartSize++;

                //Update the local store
                localStorage.setItem('cartItems', JSON.stringify(this.shopingCart));
            }


            //Get data from localstore
            const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');

            if(localStorage.getItem('lessonsStoreLocal') != null) {
                localStorage.setItem('lessonsStoreLocal', JSON.stringify(this.fetchedData));
            }   
        },

        //Check if the lesson has more spaces
        isDisable: function(spaces) {
            return spaces == 0;
        },

        //Search the lessons by input value
        searchLesson: function() {
            this.searchedData = this.fetchedData.filter(lesson => {
                let keysearch =  lesson.subject + ' ' + lesson.location;
                
                //Check if the search input value is included in lesson info
                if(this.searchValue != '') {
                    if(keysearch.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase())) {
                        return lesson;
                    }   
                } else {
                    return lesson;
                }
           }) 
        },

        //Fetch data from JSOn file function
        fetchData: function() {
            fetch('./lessons.json')
                .then(response => response.json())
                .then(data => {
                    //Get data from local store
                    const lessonsStoreLocal = localStorage.getItem('lessonsStoreLocal');
            
                    //Save data to array and search, to update the rendered list
                    if(lessonsStoreLocal == null) {
                        localStorage.setItem('lessonsStoreLocal', JSON.stringify(data));
                        this.fetchedData = data;
                        this.searchLesson(); //Update the rendering list
                    } else {
                        this.fetchedData = JSON.parse(lessonsStoreLocal);
                        this.searchLesson(); //Update the rendering list
                    }

                }).catch(error => {
                    console.error('Error loading data:', error);
                });

                //Save Cart Items in local Store
                const cartLocalStore = localStorage.getItem('cartItems');

                if(cartLocalStore != null) {
                    this.shopingCart = [],
                    this.shopingCart = JSON.parse(cartLocalStore);
                    this.cartSize = this.shopingCart.length;
                }
        }
    }
});


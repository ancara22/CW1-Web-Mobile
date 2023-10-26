//Lessons page Vue application
const lessons_app = new Vue({
    el: '#app',
    data: {
        fetchedData: [],        //Fetched data from Json file
        searchedData: [],       //Sorted data and filtered by search input. Render content
        shopingCart: [],        //Shoping cart clist
        cartSize: 0,            //Number of items in the cart
        sortBy: 'subject',      //Sort by. subject-default
        sortDirection: 'asc',   //Sort direction. ASC-default
        searchValue: '',        //Searche input value
        currentPage: true,      //Page to display, home = true, cart = false
        message: '',            //Message to dispaly after checkout
        userPhoneNr: '',        //User Phone Number
        userName: ''            //User name
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
        },

        activeCheckout: function() {
            return this.userName != '' && this.userPhoneNr != '' && this.shopingCart.length != 0 ? true : false;
         }
    },

    created: function() {
        //Fetch the data from JSON file on page open
        this.fetchData();

        
    },

    methods: {
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
            }
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
                    this.fetchedData = data;
                    this.searchLesson(); //Update the rendering list
                }).catch(error => {
                    console.error('Error loading data:', error);
                });
        },
        //Remove items from the cart
        removeItem: function(idx, id) {
            //Remove by ID
            this.shopingCart.splice(idx, 1);
            this.cartSize--;

            //Update the available spaces
            this.fetchedData.map(lesson => { 
                if(lesson.id == id && lesson.spaces < 5)  
                    lesson.spaces++;
            });

        },

        //Event hadler, on click, send the order
        sendOrder: function() {
            this.message = 'Order Succes! Thank you for your order ' + this.userName;
            this.userName = '';
            this.userPhoneNr = '';
            //Empty shoping cart? Not required

            //Remove the messahe after timeout
            setTimeout(() => {
                this.message = '';
            }, 3000)
        },

        //Check if input is a number
        isNumber: function(event) {
            if (!/\d+/.test(event.key) )
                return event.preventDefault(); //Prevent typing
        },

        //Check if input is a letter
        isLetter: function(event) {
            if (!/[A-Za-z]+/.test(event.key) )
                return event.preventDefault(); //Prevent typing
        },

        //Check if the lesson has more spaces
        isDisable: function(spaces) {
            return spaces == 0;
        },
        
        isCartDisable: function() {
            return this.cartSize == 0;
        }, 

        //Event handler, on click go to Cart page
        changePage: function() {
            this.currentPage = !this.currentPage;
        }


    }
});


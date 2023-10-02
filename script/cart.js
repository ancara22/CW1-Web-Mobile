

//Cart vue aplication
const cart = new Vue({
    el: '#cart_app',
    data: {
        lessonsList: [],    //List of all lessons
        shopingCart: [],    //list of items in the cart
        message: '',        //Message to dispaly after checkout
        userPhoneNr: '',    //User Phone Number
        userName: ''        //User name
    },

    //Get data from locastore
    created: function() {
        const cartLocalStore = localStorage.getItem('cartItems');
        
        if(cartLocalStore != null) {
            this.shopingCart = [],
            this.shopingCart = JSON.parse(cartLocalStore);
        }
    },

    computed: {
        //Check if the checkout inputs are
        activeCheckout: function() {
           return this.userName != '' && this.userPhoneNr != '' && this.shopingCart.length != 0 ? true : false;
        }
    },

    methods: {
        //Remove items from the cart
        removeItem: function(idx, id) {
            //Remove by ID
            this.shopingCart.splice(idx, 1);

            //Update the local store
            localStorage.setItem('cartItems', JSON.stringify(this.shopingCart));
            this.lessonsList = JSON.parse(localStorage.getItem('lessonsStoreLocal'));
            

            //Update the available spaces
            this.lessonsList.map(lesson => { 
                if(lesson.id == id && lesson.spaces < 5)  
                    lesson.spaces++;
            });

            //Set the local store
            localStorage.setItem('lessonsStoreLocal', JSON.stringify(this.lessonsList));
        },

        //Event hadler, on click, go to lessons page
        goToLessons: function() {
            window.location = '../html/lessons.html';
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

    }
})
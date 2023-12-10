//Lessons page Vue application
const lessons_app = new Vue({
    el: '#app',
    data: {
        lessonsList: [],        //Fetched data from Json file
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

    created: function() {
        this.fetchData();    //Fetch data on page created
    },

    computed: {
        //Sort the Rendered list
        sortedList: function() {
            return this.lessonsList.sort((a, b) => {
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

        //Check the checkout status
        activeCheckout: function() {
            return this.userName != '' && this.userPhoneNr != '' && this.shopingCart.length != 0 ? true : false;
        }
    },

    methods: {
        //Fetch data from the database
        fetchData: async function() {
            await fetch(`https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/lessons?src=` + this.searchValue
                ).then(response => response.json()
                ).then(data => { 
                    this.lessonsList = data;
                }).catch(error => {
                    console.error('Error loading data:', error);
                });
        },

        //Search the lessons on input change
        onSearchInputChanged: function() {
            this.fetchData();
        },
         
        //Event handler, on button click add the item to shopping cart
        addToCart: function(id) {
            //Find the lesson by ID and update the spaces
            let item = this.lessonsList.filter(lesson => { 
                    if(lesson._id == id && lesson.spaces > 0)  {
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

        //Remove items from the cart
        removeItem: function(idx, id) {
            //Remove by ID
            this.shopingCart.splice(idx, 1);
            this.cartSize--;

            //Update the available spaces
            this.lessonsList.map(lesson => { 
                if(lesson._id == id && lesson.spaces < 5)  
                    lesson.spaces++;
            });
        },

        //Event hadler, on click, send the order
        sendOrder: async function() {
            let itemsMap = new Map();

            //Extract the ids from the shoping cart, and count the items
            this.shopingCart.forEach(item => {
                let id = item._id;

                if(itemsMap.has(id)) {
                    itemsMap.set(id, itemsMap.get(id) + 1)
                } else {
                    itemsMap.set(id, 1);
                }
            });

            //Formate the cart result
            let itemsArray = Array.from(itemsMap.entries()).map(([id, count]) => ({
                id: id,
                count: count
            }));

            //Create the order object
            let order = {
                name: this.userName,
                phone: this.userPhoneNr,
                IDs: itemsArray
            };

            //Place the order
            await fetch("https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/placeorder", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(order),
                }).then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Server POST error! Status: ${resp.status}`);
                    } 
                    return resp; 
                }).then((data) => {
                    if(data.status == 200) {
                        this.message = 'Order Succes! Thank you for your order ' + this.userName;
                        this.updateTheSpaces(order.IDs);

                        this.cleanInputs();     //Clean the shoping cart
                    } else {
                        this.message = 'Error placing the order.';
                    }
                }).catch(error => {
                    console.error('Error placing order:', error);
                });
        },

        //Clean the checkout inputs
        cleanInputs: function() {
            //Clear thecheckout inputs
            this.userName = '';
            this.userPhoneNr = '';

            //Empty the shoping cart
            this.shopingCart = [];
            this.cartSize = 0;

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
        
        //Check if the cart button is disabled
        isCartDisable: function() {
            return this.cartSize == 0;
        }, 

        //Event handler, on click go to Cart page
        changePage: function() {
            this.currentPage = !this.currentPage;
        },

        //Update the database
        updateTheSpaces: async function(orderIDs) {
            await fetch("https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/update-spaces", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderIDs),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Server PUT error! Status: ${resp.status}`);
                } 
                return resp; 
            }).then((data) => {
                if(data.status == 200) {
                    console.log('Database updating succes!');
                } else {
                    this.message = 'Error updating the database.';
                }
            }).catch(error => {
                console.error('Error updating the database:', error);
            });
        }
    }
});


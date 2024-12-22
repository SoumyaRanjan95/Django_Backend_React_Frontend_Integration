/* This will be converted to models in Django*/


/*
This Data has been added to get an overview of how the data will roughly look for the frontend.
Then this will be translated accordingly to represent model relationships in Django 
*/



export const Restaurants = [
    {id:1, name:"Pulse Restaurant", city: "Tirupati"},
    {id:2, name:"The Taj Grande", city: "Bengaluru"},
    {id:3, name:"The Haskeville", city: "Chennai"},
    {id:4, name:"Marriots's Dine In", city: "Chennai"},
    {id:5, name:"Cottage Waves", city: "Mumbai"},
    {id:6, name:"The Highlander", city: "Delhi"},
    {id:7, name:"Soros Heights", city: "Delhi"},
    {id:8, name:"The Maharaj's", city: "Gurugram"},
    {id:9, name:"Bawarchi", city: "Delhi"},
    {id:10, name:"Dalma", city: "Bhubaneshwar"},
    {id:11, name:"Southern Spice", city: "Bengaluru"},
    {id:12, name:"Highway King", city: "Bengaluru"},

];

export const Reservations = [
    {
        mobile:'1234567890',
        date: new Date().toUTCString(), //custom date input
        slot: new Date().toUTCString(), //time slot
        guests: 2,
        reservation_at: 'Restaurant Name', // restaurant id
        reservation_token: 'abcd5',

    },
    {
        mobile:'1234567890',
        date: new Date().toUTCString(), //custom date input
        slot: new Date().toUTCString(), //time slot
        guests: 2,
        reservation_at: 'Restaurant Name', // restaurant id
        reservation_token: 'abcd5',

    },
    {
        mobile:'1234567890',
        date: new Date().toUTCString(), //custom date input
        slot: new Date().toUTCString(), //time slot
        guests: 2,
        reservation_at: 'Restaurant Name', // restaurant id
        reservation_token: 'abcd5',

    }
]


export const RestaurantUser = [
    {
        mobile:'1234567890', //unique
        email:'tammy@gmail.com',
        fullname:'Tammy Narayan',
        password:'1234567890',
        is_authenticated: false,
        is_staff:true,
    },
    {
        mobile:'9876543210',
        email:'tammy@gmail.com',
        fullname:'Tammy Narayan',
        password:'1234567890',
        is_authenticated: false,
        is_staff:false,
    },
    {
        mobile:'1598746320',
        email:'tammy@gmail.com',
        fullname:'Tammy Narayan',
        password:'1234567890',
        is_authenticated: false,
        is_staff:false,
    },
]

//is_staff to be checked
export const RestaurantStaff = [
    {
        mobile:'1234567890',
        staff_of_restaurant:2, //restaurant-uuid

    },
]



export const ItemsOrdered = [
    {
        order_id: 2, 
        from_restaurant:5, //In Django
        item:'Chicken Biriyani',
        type: 'starters',
        vegOrNonVeg:'nonveg', 
        quantity:3,
        item_price_from_restaurant: 150, //Restuarnat.Menu.price
        mobile:'1234567890'
    },

];




export const orderData = [
    {
        order_id: 2,
        order_datetime: new Date().toUTCString(),
        from_restaurant: 5,
        reservation_token: 'daldkasldkaldk',
        tableNo: 3,
        processed:false,
        menu_items:[ //Return an array of items from Item Model
            {item:"hc", no:5}
        ],
        mobile:'1234567890'


    },
 

]


//Menu
export const Menu = [

    {id: 1,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: false, restaurant_id:1,},
    {id: 2,type:'starters', name: 'Gobi 65', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true ,restaurant_id:1,},
    {id: 3,type:'starters', name: 'Paneer Manchurian', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 4,type:'starters', name: 'Kadai Paneer', vegOrNonVeg: 'veg', price:150, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 5,type:'biryani', name: 'Chicken Biryani', vegOrNonVeg: 'nonveg', price:550, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 6,type:'biryani', name: 'Mutton Biryani', vegOrNonVeg: 'nonveg', price:508, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 7,type:'biryani', name: 'Paneer Biryani', vegOrNonVeg: 'veg', price:505, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 8,type:'biryani', name: 'Prawn Biryani', vegOrNonVeg: 'nonveg', price:1050, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 9,type:'bread', name: 'Kulcha', vegOrNonVeg: 'veg', price:950, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 10,type:'bread', name: 'Naan', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 11,type:'bread', name: 'Rumali Roti', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 12,type:'Soup', name: 'Chicken Hot & Sour Soup', vegOrNonVeg: 'nonveg', price:150, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 13,type:'starters', name: 'Chicken Manchow Soup', vegOrNonVeg: 'nonveg', price:850, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 14,type:'starters', name: 'Veg Hot & Sour', vegOrNonVeg: 'veg', price:508, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 15,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:509, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 16,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:450, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 17,type:'bread', name: 'Kulcha', vegOrNonVeg: 'veg', price:950, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 18,type:'bread', name: 'Naan', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 19,type:'bread', name: 'Rumali Roti', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 20,type:'Soup', name: 'Chicken Hot & Sour Soup', vegOrNonVeg: 'nonveg', price:150, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 21,type:'starters', name: 'Chicken Manchow Soup', vegOrNonVeg: 'nonveg', price:850, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 22,type:'starters', name: 'Veg Hot & Sour', vegOrNonVeg: 'veg', price:508, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 23,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:509, info: "Dry curry", available: true,restaurant_id:1,},
    {id: 24,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:450, info: "Dry curry", available: false,restaurant_id:1,},
    {id: 25,type:'biryani', name: 'Paneer Biryani', vegOrNonVeg: 'veg', price:505, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 26,type:'biryani', name: 'Prawn Biryani', vegOrNonVeg: 'nonveg', price:1050, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 27,type:'bread', name: 'Kulcha', vegOrNonVeg: 'veg', price:950, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 28,type:'bread', name: 'Naan', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 29,type:'bread', name: 'Rumali Roti', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 30,type:'Soup', name: 'Chicken Hot & Sour Soup', vegOrNonVeg: 'nonveg', price:150, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 31,type:'starters', name: 'Chicken Manchow Soup', vegOrNonVeg: 'nonveg', price:850, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 32,type:'starters', name: 'Veg Hot & Sour', vegOrNonVeg: 'veg', price:508, info: "Dry curry", available: true,restaurant_id:2,},
    {id: 33,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:509, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 34,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:450, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 35,type:'bread', name: 'Kulcha', vegOrNonVeg: 'veg', price:950, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 36,type:'bread', name: 'Naan', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 37,type:'bread', name: 'Rumali Roti', vegOrNonVeg: 'veg', price:50, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 38,type:'Soup', name: 'Chicken Hot & Sour Soup', vegOrNonVeg: 'nonveg', price:150, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 39,type:'starters', name: 'Chicken Manchow Soup', vegOrNonVeg: 'nonveg', price:850, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 40,type:'starters', name: 'Veg Hot & Sour', vegOrNonVeg: 'veg', price:508, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 41,type:'starters', name: 'Gobi Manchurian', vegOrNonVeg: 'veg', price:509, info: "Dry curry", available: false,restaurant_id:2,},
    {id: 42,type:'starters', name: 'Tobi Manchurian', vegOrNonVeg: 'veg', price:450, info: "Dry curry", available: true,restaurant_id:2,},

];


export const BillData =  [
    {
        bill_reference_id:'asderf',
        bill_datetime: new Date().toUTCString(),
        order_id: 2,
        from_restaurant: 2, //restaurant id
        mobile:'1234567890',

    },

]
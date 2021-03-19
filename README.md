Hey There!
This is the backend part of a full stack e-commerce application. The frontend part can be found here - 
https://github.com/Nischalj10/ecommerce-frontend

This project has already been deployed on Heroku. To view the finished application, kindly visit the following link-
https://nischal-ecommerce-frontend.herokuapp.com/ 
(It take a minute to load though <3 )

Since it would not be right to share the admin profile of the application publicly, I have made this demonstration 
video about the platform, kindly see it here once you have explored the application -
https://drive.google.com/file/d/1_2XekH6N0NmhyO3rCeLxGK4V-3-1938l/view?usp=sharing

Still, one can always drop a mail on my website and I'd be happy to share the admin credentials or make them admin.
Here's my website - https://nischaljain.live/

If you wish to run the app on your localhost, kindly follow the below steps : 

1. Clone the repository
2. Make a .env file in the root directory and add the following code

DATABASE='mongodb+srv://nischal:1234abcd@cluster0.3fljs.mongodb.net/<dbname>?retryWrites=true&w=majority'
PORT=8000
CLOUDINARY_CLOUD_NAME=idean
CLOUDINARY_API_KEY=173844877382259
CLOUDINARY_API_SECRET=8QfvfLtcOjc_1puS-JWw9NZpri4
STRIPE_SECRET=sk_test_51ISNEvECvaWr7wKLjk14QazqPZZiZZwLQPaawHmMMz4NAlhTgXfUosfncXpeP3xB5QkzQAzUcEvbX8BIVOERBYW700RtJK1Hcu

3. Migrate to the root folder and run -> npm start in console.

The backend app should build. You also need to follow the steps in the README.md file of the following repository
to run the frontend as well - 
https://github.com/Nischalj10/ecommerce-frontend


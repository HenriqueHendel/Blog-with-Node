# Node Blog

## About This Project
It is a simple blog, where the Admin (can be more than one person or only the owner/author of blog) can write, update and delete posts and categories. The users can access the blog only to read the posts

This project is a part of my personal portfilio and my objective is improve my code skills and knowledge every day. So, if you could provide me any feedback, I will be very happy :)

## Some Observations 

1 - I have display in the navbar manu the items "Login", "My Posts", "My Categories" and "Logout", but it's only for the admin user. The normal user will only see "Home" and "Categories"

2 - There are only programming categories, but you can create any kind of category

## How It Works
- As admin, you can access the page "My Posts" and see all post that you have. So, you can write, delete or edit a post (photo 03)

- You can select a category to your post (eg. food, vacations, programming, etc.). In the page "My Categories", you can see all categories that you have, and edit, write or delete a category. (photo 02)

- To write a post, you have to be admin and choice some category (C#, PHP, BackEnd, etc), beyond the Title, Content and Slug. (photo 02)

- "Slug" is the text that will appear at the URL of your post, for example "http://MyBlog/post/the-best-place-to-vacations", where "the-best-place-to-vacations" is the slug

- As normal user, you can only access the pages "Home", to see all posts, or "Categories", to see all categories and filter the content (By selecting a category, will only appear the posts that are of the category selected) (photo 01 and photo 02)

## Some Photos
### Initial Page and Login Admin Screen
![Initial Page](https://github.com/HenriqueHendel/Blog-with-Node/blob/master/Fotos_readme/new_post.jpg)

### Categories and New Post page
![Initial Page](https://github.com/HenriqueHendel/Blog-with-Node/blob/master/Fotos_readme/foto_02.jpg)

### Posts and Categories pages for the admin
![Initial Page](https://github.com/HenriqueHendel/Blog-with-Node/blob/master/Fotos_readme/foto_03.jpg)

### Posts and Post pages
![Initial Page](https://github.com/HenriqueHendel/Blog-with-Node/blob/master/Fotos_readme/foto_04.jpg)

### Initial Page Again
![Initial Page](https://github.com/HenriqueHendel/Blog-with-Node/blob/master/Fotos_readme/foto_05.jpg)


## Built With

- [NodeJS](https://nodejs.org/en/)
- [MongoDB](mongodb.com)
- [Express](https://expressjs.com/)
### Modules and Librays used
- [Handlebars](https://handlebarsjs.com/)
- [BodyParser](https://github.com/expressjs/body-parser)
- [Mongoose](https://mongoosejs.com/)
- [Passport](http://www.passportjs.org/)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

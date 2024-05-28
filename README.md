# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).


## Introduction

Northcoders News API is a mimic of building a real-world backend service that provides information to the front-end architecture.



## Features

- Get a list of topics
- Get a list of available endpoints
- Get a single article by article_id
- Get a list of articles
- Get a list of comments by article_id
- Post a comment by article_id
- Patch an article by article_id
- Delete a comment by comment_id
- Get a list of users
- Allow articles to be filtered and sorted
- Add a comment count to the response when retrieving a single article


## Installation

1. Clone the repo:

   ```sh
   git clone https://github.com/Esther299/Project-nc-News
   cd be-ns-news
   ```
2. Set-up environment variables:

    ```sh
    1st: Create the environment files in the root of your project directory:
        .env.development
        .env.test
    2nd: Add the necessary environment variables to each file: 
        In .env.development ---> PGDATABASE=nc_news
        In .env.test ---> PGDATABASE=nc_news_test
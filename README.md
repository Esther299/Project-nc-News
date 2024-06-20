# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in
Software Engineering provided by [Northcoders](https://northcoders.com/).

## Introduction

Northcoders News API is a backend service that provides information to the front-end architecture, mimicking a real-world backend service. To see the API in action, visit: https://project-nc-news-8dvh.onrender.com/

#### Features

- Get a list of available endpoints
- Get a list of topics
- Get a list of articles
- Get a list of users
- Get a single article by `article_id`
- Get a list of comments by `article_id`
- Post a comment by `article_id`
- Post an article
- Post a new topic
- Patch an article by `article_id`
- Patch a comment by `comment_id`
- Delete an article by `article_id`
- Delete a comment by `comment_id`
- Add `comment_count` to the list of articles
- Allow articles to be filtered and sorted
- Add a comment count to the response when retrieving a single article

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js: Minimum version v21.6.2
- PostgreSQL: Minimum version 15.6 (Ubuntu 15.6-0ubuntu0.23.10.1)

### Installation

1. Clone the repo:

   ```sh
   git clone https://github.com/Esther299/Project-nc-News
   cd be-ns-news
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

      1. Create the environment files in the root of your project directory:
            - `.env.development`
            - `.env.test`
            - `.env.production`
            
      2. Add the necessary environment variables to each file:
         - In `.env.development`:
         ```sh
         PGDATABASE=nc_news
         ```
         - In `.env.test`:
         ```sh
         PGDATABASE=nc_news_test
         ```
         - In `.env.production`:
         ```sh
         DATABASE_URL=postgres://postgres.ifgfhosmqwdupnieigze:******************@aws-0-eu-west-2.pooler.supabase.com:5432/postgres
         ```
                  
4. Set up the database:

   ```sh
   npm run setup-dbs
   npm run seed
   ```

### Running the Application

This command will run the aplication:

```
npm run start
```

#### Running Tests

This command will run the test suite and output the results:

```
npm run test
```

## Contact

For any questions or issues, please contact Esther at esthergc_2@hotmail.com.
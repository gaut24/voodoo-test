# Candidate Takehome Exercise
This is a simple backend engineer take-home test to help assess candidate skills and practices.  We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment.  This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete.  Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.  

We value your time, and you should too.  If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish. 

The theory portions of this test are more open-ended.  It is up to you how much time you spend addressing these questions.  We recommend spending less than 1 hour.  


For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments.  We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview
This project is a simple game database and consists of 2 components.  

The first component is a VueJS UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from an SQLite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase.  However, this type of stack is in regular use at Voodoo.

# Project Setup
You will need to have Node.js, NPM, and git installed locally.  You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`.  Then run `git add .` to add all of the relevant files.  Then `git commit` to complete the repo setup.  You will send us this repo as your final product.
  
Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments
Pretend for a moment that you have been hired to work at Voodoo.  You have grabbed your first tickets to work on an internal game database application. 

#### FEATURE A: Add Search to Game Database
The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform.  The front end team has already created UI for these features and all that remains is for the API to implement the expected interface.  The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string.  If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps
Add a populate button that calls a new route `/api/games/populate`. This route should populate your database with the top 100 games in the App Store and Google Play Store.
To do this, our data team have put in place 2 files at your disposal in an S3 bucket in JSON format:

- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json
- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json

# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:
We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.

    To make your Express/Vue.js project production-ready, here's an updated action plan:

    1. Code Coverage: Expand your test coverage beyond the controller layer. Implement end-to-end and integration tests using tools like Cypress or Playwright to ensure the behavior of the entire application and API.

    2. Database: Move from using SQLite to a more powerful database such as PostgreSQL. Consider using a DBaaS like AWS Aurora for scalability and reliability. Create a clean and protected database configuration file.

    3. Security: Implement a security layer for the API to allow only authenticated users to interact with the application and API. Consider using JWT tokens for authentication. Create different user roles to control access to various features. Implement measures to protect against common vulnerabilities like XSS and DDoS attacks.

    4. Error Handling: Centralize error handling and set up alerts for critical errors. Ensure that errors are clear and meaningful for easy debugging. Tools like Sentry can help with error monitoring and alerting.

    5. Performance Monitoring: Monitor application performance metrics such as endpoint latency and real-time error rates. Consider using tools like Datadog to set up Service Level Indicators (SLIs) and Service Level Objectives (SLOs) to gain insights into user experience and performance.

    6. Deployment: Implement a robust CI/CD pipeline to automate the deployment process and prevent regressions. Include steps for building, testing, and deploying the application. Consider using tools like Jenkins, GitLab CI/CD, or AWS CodePipeline to streamline the deployment workflow.


#### Question 2:
Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.

    In my opinion, we should automate the file ingestion process instead of relying on daily user actions. Here's an updated version of the action plan:

    1. Automation Trigger: Set up an event trigger on the S3 bucket to automatically initiate the file ingestion process whenever a new file is added. This can be achieved using AWS Lambda.

    2. File Ingestion Function: Create a Lambda function that will handle the file ingestion process. This function will be triggered when a new file will be created.

    3. File Processing and Validation: Within the Lambda function, implement the necessary logic to process and validate the incoming files. This may involve parsing the file, extracting relevant data, performing transformations, and validating the data against predefined rules or schemas.

    4. API Integration: Refactor the 'api/games/populate' endpoint to accept JSON directly in the body of the request instead of relying on URLs. Modify the Lambda function to make API calls to this endpoint, passing the processed and validated data as JSON.

    5. Error Handling and Retries: Implement error handling mechanisms within the Lambda function to handle errors that occur during file ingestion or API calls. Set up automatic retries for transient failures to ensure robustness. Additionally, post error messages or notifications to a Slack channel to alert the team about any issues.

    6. Monitoring Performance and Errors: Utilize a monitoring tool like Datadog to track the performance and errors in the file ingestion process. Monitor key metrics such as processing time, error rates, and resource utilization. This will help identify bottlenecks and ensure the system is running smoothly.



#### Question 3:
Both the current database schema and the files dropped in the S3 bucket are not optimal.
Can you find ways to improve them?

    First of all, we should start by restructuring the database to normalize it. For example, the publisher should have its own table. Normalization helps organize data in a structured manner, reducing redundancy, and ensuring consistency. It allows for the enforcement of data consistency rules. Additionally, normalized databases improve efficiency in terms of storage and performance. As said before, we should also use another DB such as PostgreSQL.

    Instead of relying on files in S3, we can directly integrate APIs from both providers. This approach reduces the complexity of the ingestion pipeline and enables us to fetch data in real-time and process it directly within our API. To ensure seamless integration, I recommend implementing a contract when communicating with these APIs. This contract will define the expected data format and establish a mechanism for being notified if the data format changes. By proactively monitoring and adapting to any changes in the data format, we can ensure the continuous and accurate ingestion of data from the providers' APIs.




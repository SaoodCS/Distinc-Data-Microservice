# Microservice Template

## Express Microservice Terminology:

- A _route prefix_ is a microservice
- A _subroute_ is a service / cloud function within the microservice that can be accessed via an endpoint
- Example URL: `https://www.example.com/api/[routePrefix]/[subRoute]`
- Example Microservice / Route Prefix = _"Users"_:
  - Example Subroutes / Services / Cloud Functions = _"getUserData"_, _"updateUserData"_, _"deleteUserData"_, etc.

---

## Initial Setup:

- **Pre-requisite 1:** Setup the front-end repo based on the [react-typescript-vite-template](https://github.com/SaoodCS/react-typescript-vite-template)\_
- **Pre-requisite 2:** Setup the api-gateway repo based on the [api-gateway-template](https://github.com/SaoodCS/api-gateway-template)\_

1. Run `npm run install` in the root directory
2. Open the project settings for the `dev` Firebase project and copy the `Project ID`
3. Open VSCode and search for `[dev-project-id]` and replace all instances of `[dev-project-id]` with the dev Firebase project ID
4. Repeat steps 2 and 3 for the `prod` Firebase project, replacing all instances of `[prod-project-id]` with the prod Firebase project ID
5. Go to _root/functions/src/global/utils/CollectionsRefs.ts_ -> update this class with the names of the collections you'll be using in Firestore
6. Go to _functions/src/index.ts_ → replace all instances `routePrefixName`  with the name of the microservice
7. If the cloud function / subRoute you are creating is a `GET` request:

   1. Got to _functions/src/index.ts_ → replace `app.post` with `app.get` if the cloud function is a GET request
   2. Go to _functions/src/subRouteName/endpoint/endpoint.ts_ → delete the following:

      - ```typescript
               const reqBody = req.body;
            try {
        	      if (!SubRouteNameReqBody.isValid(reqBody)) {
        		   throw new ErrorThrower(
        			   'Invalid Body Request',
        			   resCodes.BAD_REQUEST.code,
        		   );
               }
            }
        ```

8. Go to _functions/src/index.ts_ → replace all instances of `subRouteName` with the name of the cloud function
9. Go to _functions/src/subRouteName/endpoint/endpoint.ts_ → replace `subRouteName` with the name of the cloud function
10. Go back to _functions/src/index.ts_ → replace the old import for `subRouteName` with the import for the new renamed cloud function
11. Go to _root/package.json_ → for the 2 `deploy...`  scripts, replace `routePrefixName` with the name of the microservice
12. Go to _.github/workflows/ci-cd.yml_:
    1. Change the `name` of the workflow at the top to `[Name-Of-Microservice] Microservice CI/CD`
    2. Change the `microservice-ci-cd` below `jobs` to `[name-of-microservice]-ci-cd`
13. If the cloud function / subRoute you are creating is a `POST` request:
    1. Go to _functions/src/subRouteName/reqBodyClass/SubRouteNameReqBody.ts_:
       1. Change all instances of the name of `ISubRouteNameReqBody` to `I[nameOfCloudFunction]ReqBody`
       2. Update this interface to include properties that will be sent in the request body from the client to the cloud function
       3. Change the name of the class `SubRouteNameReqBody` to `[nameOfCloudFunction]ReqBody`
       4. Update the `isValid` method to check the validity of the request body being sent by the client to ensure it’s in the shape of the interface
    2. Go to _src/subRouteName/endpoint/endpoint.ts_ → replace `SubRouteNameReqBody` with the class `[nameOfCloudFunc]ReqBody` → import the class
    3. Rename the file _SubRouteNameReqBody.ts_ to *[nameOfCloudFunction]ReqBody.ts*
14. Rename the folder _subRouteName_ to the name of the cloud function
15. in VS Code do a final search for `routePrefixName` and replace all instances of `[routePrefixName]` with the name of the microservice
16. Push any changes in the current branch -> then create a new branch from `prod` called `dev` -> then push the new branch to the remote repo

### Environment Variables Initial Setup:

1. Copy the `API_KEY` env variable from the _.env_ files in the _api-gateway_ repository
2. In this microservice repo, go to _root/functions_ and create a new file called _.env_
3. Paste the `API_KEY` env variable from the _.env_ files in the _api-gateway_ repository
4. Go to GitHub Secrets for this repository -> create a new secret called **_DEV_AND_PROD_ENV_VAR_** -> paste the content from the _.env_ file into the value field and create the secret

### Firebase SA Key & GitHub Actions Setup:

#### For each Firebase Project (dev and prod), do the following:

1. Open the api-gateway repo -> Go to _root/functions/env_ -> Open the `[dev/prod-project-id].json` file -> copy the content
2. Go to GitHub Secrets for this repository -> create a new secret called `[DEV/PROD]_SA_KEY` -> paste the content from the `[dev/prod-project-id].json` file into the value field and create the secret

### In the Api Gateway repository, do the following:

1. Add the following to each of the `.env...` files:
   - `.env.deploydev` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=https://us-central1-[dev-firebase-proj-id].cloudfunctions.net/[microserviceName]/[subRouteName]`
   - `.env.deployprod` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=https://us-central1-[prod-firebase-proj-id].cloudfunctions.net/[microserviceName]/[subRouteName]`
   - `.env.localdev` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=http://localhost:9000/[dev-firebase-project-id]/us-central1/[microserviceName]/[subRouteName]`
   - `.env.localprod` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=http://localhost:9000/[prod-firebase-project-id]/us-central1/[microserviceName]/[subRouteName]`
2. Go to _GitHub Project Settings -> Secrets_ for the _api-gateway_ repo
3. Update the `DEV_ENV_VARIABLES` secret with the contents from the `.env.deploydev` file
4. Update the `PROD_ENV_VARIABLES` secret with the contents from the `.env.deployprod` file
5. _(Optional)_ → add the different endpoint urls for the new cloud function endpoint to Google Chrome bookmarks
6. Go to _root/funtions/src/utils/Microservices.ts_ and add a new object to the `microservices` array with the following properties:
   - `service`: `[nameOfSubroute]`
   - `url`: `process.env.[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT`
   - `los`: `[leve-of-security-number]` (info about the different levels of security can be found in _root/functions/src/utils/LevelOfSecurity.ts_)
7. Go to _root/functions/src/endpoints/endpoints/ts_ and update the variable `serviceForLocalTesting` with the name of the new subroute (the same as defined in Microservice.ts)
8. Merge the changes made between branches

### In the Front-End React app:

1. Go to _root/src/firebase/api/microservices/microservices.ts_ and add a new object to the `microservices` object called `[nameOfSubroute]` with the following properties:
   - `name`: `[nameOfSubroute]`
   - `los`: `[leve-of-security-number]`

---

## --- INITIAL SETUP DONE ---

---

## Developing & Testing Locally:

1. In _front-end react project_ checkout to the _dev_ branch -> run `npm run start-dev-to-local`
2. In _snrg-connect-api-gateway_ checkout to the _dev_ branch -> run `npm run serve-dev-to-local`
3. In _the new microservice repo_ checkout to the _dev_ branch -> run `npm run serve-dev`

## Testing The Deployed Versions:

### Option 1: From localhost on the front-end to deployed on the back-end:

1. Deploy the latest versions of the _api-gateway_ and the _microservice_ to the _dev_ and _prod_ Firebase projects if not already deployed
2. Checkout to the _dev_ branch if not already in it
3. Run `npm run start-dev-to-deployed` in the root directory

### Option 2: From the deployed front-end to the deployed back-end:

1. Checkout to the _dev_ branch in the front-end if not already in it
2. Run `npm run deploy-dev` in the root directory
3. Go to the deployed webapp for the _dev_ Firebase project -> test the new microservice's endpoint to make sure it works as expected

---

## Adding More Cloud Functions / Services / Subroutes:

### In the Microservice Repo:

1. In file explorer, open the Microservice Template Repo → go to: _functions/src_ → copy the `subRouteName` folder
2. Paste the folder into the _functions/src_ folder of the microservice repo
3. If the cloud function / subRoute you are creating is a `GET` request:

   1. Got to _functions/src/index.ts_ → add the new cloud function as `app.get('/[subRouteName]', [subRouteName]);`
   2. Go to _functions/src/subRouteName/endpoint/endpoint.ts_ → delete the following:

      - ```typescript
               const reqBody = req.body;
            try {
        	      if (!SubRouteNameReqBody.isValid(reqBody)) {
        		   throw new ErrorThrower(
        			   'Invalid Body Request',
        			   resCodes.BAD_REQUEST.code,
        		   );
               }
            }
        ```

4. If the cloud function / subRoute you are creating is a `POST` request:
   1. Go to _functions/src/index.ts_ → add the new cloud function as `app.post('/[subRouteName]', [subRouteName]);`
5. Go to _functions/src/subRouteName/endpoint/endpoint.ts_ → replace `subRouteName` with the name of the cloud function
6. Go back to _functions/src/index.ts_ → import the new cloud function
7. If the cloud function / subRoute you are creating is a `POST` request:
   1. Go to _functions/src/subRouteName/reqBodyClass/SubRouteNameReqBody.ts_:
      1. Change all instances of the name of `ISubRouteNameReqBody` to `I[nameOfCloudFunction]ReqBody`
      2. Update this interface to include properties that will be sent in the request body from the client to the cloud function
      3. Change the name of the class `SubRouteNameReqBody` to `[nameOfCloudFunction]ReqBody`
      4. Update the `isValid` method to check the validity of the request body being sent by the client to ensure it’s in the shape of the interface
   2. Go to _src/subRouteName/endpoint/endpoint.ts_ → replace `SubRouteNameReqBody` with the class `[nameOfCloudFunc]ReqBody` → import the class
   3. Rename the file _SubRouteNameReqBody.ts_ to *[nameOfCloudFunction]ReqBody.ts*
8.  Rename the folder _subRouteName_ to the name of the cloud function
9.  Merge the changes made between branches

### In the Api-Gateway Repo:

1. For each of the .env files listed, create a new env variable for the new cloud function’s endpoints
2. Go to GitHub Secrets for the _api gateway_ repo:
   - Update the **DEV_ENV_VARIABLES** secret by copying and pasting the content from `.env.deployeddev`
   - Update the **PROD_ENV_VARIABLES** secret by copying and pasting the content from `.env.deployedprod`
3. _(Optional)_ → add the different endpoint urls for the new cloud function endpoint to Google Chrome bookmark
4. Go to _root/funtions/src/global/utils/Microservices.ts_ and add a new object to the `microservices` array with the following properties:
   - `service`: `[nameOfSubroute]`
   - `url`: `process.env.[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT`
   - `los`: `[leve-of-security-number]` (info about the different levels of security can be found in _root/functions/src/utils/LevelOfSecurity.ts_)
5. Push changes in the current branch -> Merge the changes between branches

### In the Front-End React app:

1. Go to _root/src/firebase/api/microservices/microservices.ts_ and add a new object to the `microservices` object called `[nameOfSubroute]` with the following properties:
   - `name`: `[nameOfSubroute]`
   - `los`: `[leve-of-security-number]`
2. Push changes in the current branch -> Merge the changes between branches

---

## POST DEVELOPMENT:

1. Merge the changes made to the dev branch with the main branch for the _api-gateway_ repo
2. Merge the changes made to the dev branch with the main branch for the _new microservice's_ repo
3. Merge the changes made to the dev branch with the main branch for the _front-end react project_ repo

---

## Scripts Help:

| Script Name                      | Script Description                                                       |
| -------------------------------- | ------------------------------------------------------------------------ |
| `npm run install`                | Installs all dependencies in the functions directory                     |
| `npm run install [package-name]` | Installs the specified package in the functions directory                |
| `npm run serve-dev`              | Serves the cloud functions locally to the Dev Firebase project           |
| `npm run serve-prod`             | Serves the cloud functions locally to the Prod Firebase project          |
| `npm run deploy-dev`             | Deploys the cloud functions to the Dev Firebase project                  |
| `npm run deploy-prod`            | Deploys the cloud functions to the Prod Firebase project                 |
| `npm run test`                   | Runs all tests in the functions directory                                |
| `npm run test-watch`             | Runs all tests in the functions directory with hot reloading enabled     |
| `npm run lint`                   | Runs the linter on all files in the functions directory                  |
| `npm run lint-fix`               | Runs the linter on all files in the functions directory and fixes issues |
| `npm run prettify`               | Runs prettier on all files in the functions directory                    |

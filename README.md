# api-explore-agent

This Express node application is used to control the SUT APIs

## Installation

Install dependencies by running `yarn install`

## Usage

1. First compile the API separately
2. Add the precompiled file(for now JAR file) to the compiled directory
3. Add the API information in the `API-info.json` file. Please see the feature-service API as an example.

## Endpoints

### Fetch Available APIs

To fetch the available APIs from the `API-info.json` file, send a `GET` request to `<HOST>:<PORT>/api`. The route returns the `id`and `name`of the APIs.

### Start an API

To start an API, get the API id from the `API-info.json` file and send a `GET` request to `<HOST>:<PORT>/api/start-api/<API_ID>`

**NOTE!!! - Save the PID from the Response to use it for Stop and Restart**

Example: To start the feature-service API, `http://localhost:3030/api/start-api/1` can be used.

### Stop an API

To stop an API, get the API id To start an API, obtain the API id from the `API-info.json` file and send a `POST` request to `<HOST>:<PORT>/api/start-api` with `id` and `pid` body. The `pid` is the one which is obtained from the `start` response.

### Restart an API

To restart an API, first make sure the API you want to restart should be started already, then send a `POST` request to `<HOST>:<PORT>/api/restart-api` with `id` and `pid` body.

**NOTE!!! - The default command for killing the process in stop and restart endpoints are for unix based OS. For windows OS, you can replace the `kill <PID>` with `taskkill /F /PID <PID>`.**

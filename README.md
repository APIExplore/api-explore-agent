# api-explore-agent

This Express node application is used to control the SUT APIs

## Installation

Install dependencies by running `yarn install`

## Usage

1. First compile the API separately
2. Add the precompiled file(for now JAR file) to the compiled directory
3. Add the API information in the `API-info.json` file. Please see the feature-service API as an example.

## Endpoints

### Start an API

To start an API, get the API id from the `API-info.json` file and send a `GET` request to `<HOST>:<PORT>/api/start-api/<API_ID>`

Example: To start the feature-service API, `http://localhost:3000/api/start-api/1` can be used.

### Stop an API

To stop an API, get the API id To start an API, obtain the API id from the `API-info.json` file and send a `GET` request to `<HOST>:<PORT>/api/start-api/<API_ID>`

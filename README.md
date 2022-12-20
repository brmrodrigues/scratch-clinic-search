# Pre-requisites
- Install the LTS [Node.js](https://nodejs.org/en/)


# Getting started
- Clone this repository
```
git clone git@github.com:brmrodrigues/scratch-clinic-search.git
```
- Install dependencies
```
cd scratch
npm install
```

- Run the server locally with
```
npm run dev
```

The server will start listening at PORT 3000 and the API is available for requests on the single endpoint:
`http://localhost:3000/clinicSearch`
  
Available query parameters: `name`, `state`, `from`/`to`

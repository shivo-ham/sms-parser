# SMS-PARSER

### Pre-Requisites
Check if you have Node.js 16.x, npm and node-typescript installed


### How to create a package in local
1. Clone the repository from git bash as **git clone https://`<PAT>`@github.com/annoyPR/sms-parser.git**
2. Change directory to  sms-parser, in bash this can be done by **cd sms-parser**
3. Go to project make required changes and save them 
4. Run `npm run build` this will compile all .ts files of this project to /dist directory
5. Run `npm run deploy:local`, this will compress and deploy the compressed file to $HOME directory


### How to use created library in local
1. Go to root folder of you project where **package.json** file lies
2. Delete @zype sub directory inside node_modules (if present)
3. Add ***"@zype/sms-parser":"https://github.com/Respotechnologies/sms-parser.git#main"*** to **dependencies** 
   object inside package.json
4. Change directory to where package.json is and run `npm i`
5. Test **@zype/sms-parser** library

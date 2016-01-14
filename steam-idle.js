var SteamUser = require('steam-user');
var client = new SteamUser();
var readline = require('readline');
var fs = require('fs');

var login;

if (fs.existsSync('login.json')) {
   console.log('[LOGIN] Login with saved credentials');
   var contents = fs.readFileSync('login.json');
   login = JSON.parse(contents);
   client.logOn({
      accountName: login.username,
      loginKey: login.loginKey
   });
} else {
   console.log('[LOGIN] Please sign in!');
   var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
   });

   rl.question("Username: ", function(username) {
      login = {};
      login.username = username;
      rl.question("Password: ", function(password) {
         rl.close();
         client.logOn({
            accountName: username,
            password: password,
            rememberPassword: true
         });
      });
   });
};

client.on('loggedOn', function(details) {
   console.log("[STEAM] Logged into Steam as " + client.steamID);
   client.setPersona(SteamUser.Steam.EPersonaState.Online);
   client.gamesPlayed(377160);
   console.log('[STEAM] Your games are being idled!! Sit back and earn yourself some playtime!');
});

client.on('friendMessage', function(steamID, message) {
   console.log('[MSG] ' + steamID + ': ' + message);
});

client.on('loginKey', function(key) {
   login.loginKey = key;
   fs.writeFile('login.json', JSON.stringify(login, null, 4), function(err){
      if(err) {
         console.log(err);
      } else {
         console.log('[LOGIN] Saved loginKey to \'login.json\'');
      }
   });
});

client.on('error', function(e) {
   // Some error occurred during logon
   console.log(e);
});
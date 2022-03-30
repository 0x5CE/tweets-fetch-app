let twitterConfig = {
    bearer: ""
};

export let firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

export let twitterOptions = {
    hostname: "api.twitter.com",
    path: "https://api.twitter.com/2/users",
    method: "GET",
    headers: {"Authorization": "Bearer " + twitterConfig.bearer}
};
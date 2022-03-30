import {initializeApp} from "firebase/app";
import {getFirestore, addDoc, collection} from "firebase/firestore";
import {set, ref, getDatabase} from "firebase/database";
import * as R from "ramda";
import * as https from "https";
import {firebaseConfig, twitterOptions} from "./env.js";

const config = {
    collectionName: "tweets",
    cronInterval: 5 * 60 * 1000, // in milliseconds
    userId: "1508537224895381506",
}

/* fetch all Tweets using Twitter V2 API */

async function fetchTweets() {
    return new Promise((resolve, reject) => {
        var req = https.request(
            R.assoc("path",
                R.join('/', [twitterOptions.path, config.userId, "tweets"]),
                twitterOptions),
            (res) => {
                res.on('data', (d) => {
                    resolve(JSON.parse(d));
                });
            });

        req.write(JSON.stringify({}));
        req.end();
    });
}

/* filter only the recent Tweets by keeping track of the last Tweet retreived */

async function fetchLatestTweets() {
    let tweets = await fetchTweets();
    if (R.isNil(fetchLatestTweets.recent)) {
        fetchLatestTweets.recent = 0;
    }

    // filter only the latest tweets (as sorted by ID)
    let latestTweets = R.filter(tweet =>
        R.gt(
            R.call(parseInt, tweet.id),
            R.call(parseInt, fetchLatestTweets.recent)),
        tweets.data);

    fetchLatestTweets.recent = tweets.meta.newest_id;
    return latestTweets;
}

/* it executes every once in a while and if there are new Tweets, it pushes them to a Firebase collection */

async function cronJob() {
    let tweets = await fetchLatestTweets();
    if (R.isEmpty(tweets)) {
        console.log("No new tweets");
    } else {
        console.log(tweets);

        R.map(async (item) => {
             try {
               const docRef = await addDoc(collection(db, config.collectionName), item)
               console.log("Document written with ID: ", docRef.id);
             } catch (e) {
               console.error("Error adding document: ", e);
             }
            }, tweets);
    }
}

function startCronJob() {
    cronJob();
    setInterval(cronJob, config.cronInterval);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

startCronJob();
import React, {useState, useEffect} from 'react'
import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs} from "firebase/firestore";
import * as R from "ramda";
import {firebaseConfig} from "./env.js";

const styles = {
    mainDiv: `bg-[#657786] h-screen pr-[100px] pl-[100px]`,
    tweetsTable: `bg-[#1DA1F2] pt-[25px] pb-[25px] rounded-[25px] h-fit`,
    tweet: `border-b-[#14171A] border-b-solid border-b-[1px] mb-[10px]`,
    tweetSpan: `pr-[25px] pl-[25px]`,
    input: `mb-[25px] w-[100%] p-[15px] text-[black] rounded-[16px]`
}

function Tweets() {
    const [tweets, setTweets] = useState([]); //state to store tweets
    const [text, setText] = useState("")

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const byId = R.descend(R.prop('id'));

    useEffect(() => {
        async function fetchTweets() {
            const querySnapshot = await getDocs(collection(db, "tweets"));
            
            setTweets(R.map(doc => doc.data(), querySnapshot.docs));

            // sorting by latest first
            setTweets(tweets.sort(byId, tweets));
        }
        fetchTweets()
    }, [])

return (
    <div className={styles.mainDiv}>
            <img src={require('./twitter.png')} alt="twitter" />
            <input
            value={text}
            onChange={e => setText(e.target.value)} 
            className={styles.input} 
            type="text" 
            placeholder="Search Tweet" />
        <div className={styles.tweetsTable}>
           {R.map((tweet, index) => 
                { return <div key={index} className={styles.tweet}><span className={styles.tweetSpan}>{tweet["text"]}</span></div> },
                    R.filter(tweet => R.toLower(tweet["text"]).includes(R.toLower(text)), tweets)
                )}
        </div>
    </div>
)}

export default Tweets
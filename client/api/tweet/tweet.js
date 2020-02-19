
export default class Tweet {
  constructor() {
    var test = "test"
  }

  getTweetById = (id,token) => {
    let tweet; 
    fetch('https://fnitter.herokuapp.com/api/tweets/' + id , {
        method: 'GET',
        headers: {
            'x-auth-token': token
        }
    })
    .then((res) => res.json())
    .then((data) => {
        tweet = data
    })
    return tweet;
  }

}
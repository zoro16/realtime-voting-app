const host = 'http://localhost:3001/api';
const vip_list = require('./data/vip_list.json');

var getUser = function() {
    let user = localStorage.getItem("user_coreid");
    if(user != null)
        return user;
};

export default {
    user: getUser(),
    API: {
        alpha: host + '/projects/alpha/',
        tech_funnel: host + '/projects/tech_funnel/',
        details: host + '/projects/details',
        votes: host + '/votes/',
        vote: host + '/vote/',
        users: host + '/users/'
    },
    vip_list: vip_list
};

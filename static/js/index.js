const usersKey = 'users';
const currentUser = 'currentUser';
const channelsKey = 'channels';

var channel_selected = null;

// localStorage.clear();
if (!localStorage.getItem(channelsKey)) {
    localStorage.setItem(channelsKey, JSON.stringify({}));
}

if (!localStorage.getItem(usersKey)) {
    localStorage.setItem(usersKey, JSON.stringify({}))
}

if (!localStorage.getItem(currentUser)) {
    localStorage.setItem(currentUser, null);
}

/**
 * localStorage :
 * {
 *     users {
 *         "user_1" : { "channels": ["channel_1", "channel_2", "channel_3"] },
 *         "user_2" : { "channels": ["channel_1", "channel_3", "channel_4"] }
 *     },
 *
 *     currentUser: "user_1",
 *
 *     channels {
 *         "channel_1" : {
 *              "users" : ["user_1", "user_2, "user_3"] ,
 *              "msgs" : [
 *                  {"user": "user_1",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_1},
 *                  {"user": "user_2",
 *                  "content": "content_someting",
 *                  "timestamp": timestamp_2}
 *              ]

 *         },
 *         "channel_2" : {"users" : ["user_1, user_3"]},
 *     }
 *
 * }
 * **/

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Check and Store Username
     * **/

    if (localStorage.getItem(currentUser)!=="null") {

        document.querySelector('#username').value = localStorage.getItem(currentUser);
    }
    document.querySelector('#modify-username').disabled = true;


    load_messages();
    load_channels();

    function load_channels() {
        removeChild("channels");
        let users = JSON.parse(localStorage.getItem(usersKey));
        let user = localStorage.getItem(currentUser);
        if (users.hasOwnProperty(user)) {
            let channels = users[user]["channels"];
            for (let i in channels)  {
                const channel = document.createElement('button');
                channel.className = "list-group-item list-group-item-action";
                channel.innerHTML = channels[i];
                channel.id = channels[i];
                channel.dataset.channelName = channels[i];
                document.querySelector("#channels").append(channel);
            }
        }
    }

    /**
     * load message with channels respectively.
     * **/
    function load_messages(button_id) {
        removeChild("messages");
        let user = document.querySelector("#messages").value;
        let channelName = button_id;
        let channel = JSON.parse(localStorage.getItem(channelsKey))[channelName];
        if (channel) {
            let msgs = channel['msgs'];
            for (msg in msgs) {
                let li = document.createElement('li');
                li.innerHTML = msgs['user'] + ' : ' + msgs['content'] + "--" + msgs['timestamp'];
                document.querySelector("#messages").append(li);
            }
        }

    }

    function removeChild(self_id) {
        var myNode = document.getElementById(self_id);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    document.querySelector('#username').onkeyup = () => {
        if (document.querySelector('#username').value.length > 0) {
            document.getElementById('modify-username').disabled = false;
        } else {
            document.getElementById('modify-username').disabled = true;
        }
    };

    document.querySelector('#modify-username').onclick = () => {
        const username = document.querySelector('#username').value;
        addUserInLocalStorage(username);
        localStorage.setItem(currentUser, username);
        document.getElementById('modify-username').disabled = true;
        load_channels();
        return false;
    };
    
    function addUserInLocalStorage(username) {
        if (username && username !== ''){
            let users = JSON.parse(localStorage.getItem(usersKey));
            if (!users.hasOwnProperty(username)) {
                users[username] = {};
                localStorage.setItem(usersKey, JSON.stringify(users));
                console.log(users);
            } 
        }
    }

    /**
     * New channel after clicking button, with a input to select users involved
     * **/
    document.querySelector('#new-channel').onclick = () => {

        let name = prompt("Give Channel a name");
        if (name !== null) {
            let user = document.querySelector('#username').value;
            // check channel if exists
            if (isExistingChannel(user, name)){
                alert("Channel name has been USED!!");
            }
            else {
                // save channel name
                addChannelIntoUserInfo(name);
                // add channel UI
                const channel = document.createElement('button');
                channel.className = "list-group-item list-group-item-action";
                channel.innerHTML = name;
                channel.id = name;
                channel.dataset.channelName = name;
                document.querySelector("#channels").append(channel);
            }
        }

        return false;
    };

    function isExistingChannel(channelName) {
        let username = document.querySelector("#username").value;
        if (!localStorage.getItem(usersKey)){
            return false;
        }
        if (!JSON.parse(localStorage.getItem(usersKey)).hasOwnProperty(username)) {
            return false;
        }
        let user = JSON.parse(localStorage.getItem(usersKey))[username];
        for (let i in user.channels){
            if (channelName === user.channels[i]) {
                return true;
            }
        }
        return false;
    }

    function addChannelIntoUserInfo(channelName) {
        let username = document.querySelector("#username").value;
        let users = JSON.parse(localStorage.getItem(usersKey));
        if (!users[username].hasOwnProperty('channels')) {
            users[username]['channels'] = [];
        }
        users[username]['channels'].push(channelName);
        localStorage.setItem(usersKey, JSON.stringify(users));
    }


    /**
     * listening channel if be selected.
     * **/

    // test button on click
    document.querySelectorAll("button.list-group-item, button.list-group-item-action").forEach(button => {
            button.onclick = () => {
                alert(button.id + "clicked");
            };
    });


    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.querySelectorAll("button.list-group-item, button.list-group-item-action").forEach(button => {
            button.onclick = () => {
                channel_selected = button.id;
                load_messages(button.id);
                alert(button.id + " clicked");
                let msg = prompt("Send a message.");

                if (msg) {
                    let username = document.querySelector("#username").value;
                    let timestamp = new Date().getTime();
                    storeMessage(msg, timestamp, button.id);
                    socket.emit('message', {"message": msg, "username": username, "timestamp": timestamp, "channel": button.id});
                }

            };
        });

    });

    function storeMessage(msg, timestamp, channelName) {
        let username = document.querySelector("#username").value;
        let channels = JSON.parse(localStorage.getItem(channelsKey));
        if (!channels.hasOwnProperty(channelName)) {
            channels[channelName] = {'users':[username],
                'msgs': {
                    'user': username,
                    'content': msg,
                    'timestamp': timestamp
                }
            };
        } else {
            if (!channels[channelName]['users'].includes(username)) {
                channels[channelName]['users'].push(username);
            }
            channels[channelName]['msgs'].push({
                'user': username,
                'content': msg,
                'timestamp': timestamp
            });
        }
        localStorage.setItem(channelsKey, JSON.stringify(channels));
    }


    socket.on('response', data => {
        const msg = document.createElement('li');
        msg.innerHTML = data["username"] + " : " + data["message"] + "--" + data["timestamp"];
        if (data["channel"] === channel_selected) {
            document.querySelector('#messages').append(msg);
        }

    });

});
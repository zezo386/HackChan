const API_URL = "http://127.0.0.1:8000/";

async function get_ip(){
    try {
        let request = await fetch("https://ipinfo.io/json");
        let data = await request.json();
        return data.ip;
    }
    catch(e){
        console.log(e);
    }
}

function ip_to_username(ip){

    let adjectives = ["strong","manly","beutiful","kind","baby","hyper","super"]
    let names = ["man","woman","cucumber","baby","watermelon","zebra","giraffe","integer"]

    let hash = 0;
    for (let i = 0; i< ip.length; i++){
        let char = ip.charCodeAt(i);
        hash = hash * 31 + char;
        hash = hash >>> 0;
    }
    let seed = Math.abs(hash);

    seed = ((seed * 9301 + 49297) % 233280) / 233280;

    let numbers = Math.floor(seed * 1000);

    seed = ((seed * 9301 + 49297) % 233280) / 233280;

    let adjective = adjectives[Math.floor(seed * adjectives.length)];

    seed = ((seed * 9301 + 49297) % 233280) / 233280;

    let name = names[Math.floor(seed * names.length)];

    return `${adjective}${name}${numbers}`;

    

}

async function get_posts(){
    try{
        let request = await fetch(API_URL+"get_posts/");
        if (request){
            let data = await request.json();
            for (let post of data){
                post_div = document.createElement("div");
                post_div.className = 'post';
                let username = ip_to_username(post.ip)
                post_div.innerHTML = `
                <h2 class='username'>${username}</h2>
                <p class='post-message'>${post.message}</p>
                <div class='votes'>
                <button class='upvotes' onclick='upvote(${post.id});'><span>${post.upvotes}</span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="black"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg></button>
                <button class='downvotes' onclick='downvote(${post.id});'><span>${post.downvotes}</span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="black"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg></button>
                </div>
                `;
                document.getElementById("posts").appendChild(post_div);
            }
        }
    }
    catch(e){
        console.log(e);
    }
}

async function upvote(id){
    try{
        let ip = await get_ip();

        let request = await fetch(API_URL+`toggle_upvote/?id=${id}&ip=${ip}`);
    }
    catch(e){
        console.log(e);
    }
}

async function downvote(id){
    try {
        let ip = await get_ip()

        let request = await fetch(API_URL+`toggle_downvote/?id=${id}&ip=${ip}`);
    }
    catch(e){
        console.log(e);
    }
}

async function new_post(){
    try {
        let ip = await get_ip();
        let message = document.getElementById("post-message").value;
        document.getElementById("post-message").value = "";
        body = {
            "ip": ip,
            "message": message
        };

        let request = await fetch(API_URL+"add_post/",{
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!request.ok){
            throw new Error(`HTTP error! status: ${request.status}`);
        }
    }
    catch(e){
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", get_posts)

document.getElementById("post-btn").addEventListener("click",new_post)


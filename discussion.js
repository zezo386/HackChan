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
                `;
                document.getElementById("posts").appendChild(post_div);
            }
        }
    }
    catch(e){
        console.log(e);
    }
}

async function new_post(){
    try {
        let ip = await get_ip();
        let message = document.getElementById("post-message").value;
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


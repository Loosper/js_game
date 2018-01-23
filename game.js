window.onload = function(_) {
    class Obstacle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.height = 25;
            this.width = 100;
        }
    }

    var DEFAULT_SCROLL_SPEED = 1;
    var SCROLL_SPEED = DEFAULT_SCROLL_SPEED;
    var GRAVITY = 2;
    var canvas = document.getElementById("canvas");
    var ctx;
    var player = {
        width: 50,
        height: 50,
        x: canvas.width / 2,
        y: canvas.height - 50,

        standing: function(platform) {
            return (platform.y == this.y + this.height - 1 &&
                platform.x <= this.x + this.width &&
                platform.x + platform.width >= this.x
            );
        },

        change_x: function(step) {
            if (this.x + step < 0)
                this.x = 0;
            else if (this.x + this.width + step > canvas.width)
                this.x = canvas.width - this.width;
            else
                this.x += step;
        },

        change_y: function(step) {
            if (this.y + this.height + step > canvas.height)
                this.y = canvas.height - this.height;
            else
                this.y += step;
        }
    }

    var obstacles = [];
    var leftPressed = false;
    var rightPressed = false;
    var jump_frames = 0;
    var player_stable = true;

    document.addEventListener("keydown", function(ev){
        // console.log(ev.key);
        if (ev.key == 'ArrowLeft') leftPressed = true;
        if (ev.key == 'ArrowRight') rightPressed = true;
        if (ev.key == ' ' && (player_stable  || player.y == canvas.height - player.height)) jump_frames = 25;
    });

    document.addEventListener("keyup", function(ev){
        if(ev.key == 'ArrowLeft') leftPressed = false;
        if(ev.key == 'ArrowRight')rightPressed = false;
        // else if (ev.key == ' ') spacePressed = false;
    });

    function make_obstacle(y) {
        return new Obstacle(Math.floor(Math.random() * (canvas.width - 100)), y);
    }
    
    function is_player_stable(player, obstacles){
        var player_stable = false;
        
        for (platform of obstacles) {
            if (player.standing(platform)) {
                player_stable = true;
            }
        }
        return player_stable;
    }

    function update() {
        for (platform of obstacles) {
            platform.y += SCROLL_SPEED;
        }
        player_stable = is_player_stable(player, obstacles);

        if(player.y < 0){
            SCROLL_SPEED = 3;
        }else{
            SCROLL_SPEED = DEFAULT_SCROLL_SPEED;
        }

        var top = obstacles[obstacles.length - 1];
        if (top.y + top.height > canvas.height) {
            obstacles.pop();
        }

        if (leftPressed) player.change_x(-5);
        if (rightPressed) player.change_x(5);
        if (jump_frames-- > 0) player.change_y(-jump_frames);

        if (!player_stable)
            player.change_y(GRAVITY + SCROLL_SPEED - DEFAULT_SCROLL_SPEED);
        
        window.setTimeout(update, 10);
    }

    function draw() {

        // render
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height, 0.5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#0000FF";

        for (element of obstacles) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        window.requestAnimationFrame(draw);
    }

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        alert("this browser is bad");
        return;
    }

    function generate_enemy(){
       obstacles.unshift(make_obstacle(0));
        window.setTimeout(generate_enemy, 1000);
    }

    for (var i = 0; i < canvas.height; i += 100) {
        obstacles.push(make_obstacle(i));
    }

    update();
    generate_enemy();
    draw();
}

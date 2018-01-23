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
        score: 0,
        width: 50,
        height: 50,
        x: canvas.width / 2,
        y: canvas.height - 50,

        standing: function(platform) {
            return (
                (platform.y <= this.y + this.height - 1 &&
                platform.y >= this.y + this.height - 3) &&
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
            if (this.y + this.height + step > canvas.height) {
                this.y = canvas.height - this.height;
                clearInterval(spawner);
                clearInterval(updater);
                window.cancelAnimationFrame(renderer);

                clear_canvas(1);
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 1;
                ctx.font = '48px sans-serif';
                ctx.fillText('Final score: ' + this.score, 10, 250);
            } else {
                this.y += step;
            }
        }
    }

    var obstacles = [];
    var leftPressed = false;
    var rightPressed = false;
    var jump_frames = 0;
    var player_stable = true;
    var game_going = false;
    var updater;
    var spawner;
    var renderer;

    document.addEventListener("keydown", function(ev){
        // console.log(ev.key);
        if (ev.key == 'ArrowLeft' || ev.key == 'Left') leftPressed = true;
        if (ev.key == 'ArrowRight' || ev.key == 'Right') rightPressed = true;
        if (
            ev.key == ' ' &&
            (player_stable  || player.y == canvas.height - player.height)
        )
            jump_frames = 25;
    });

    document.addEventListener("keyup", function(ev){
        if(ev.key == 'ArrowLeft' || ev.key == 'Left') leftPressed = false;
        if(ev.key == 'ArrowRight' || ev.key == 'Right')rightPressed = false;
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
        if (leftPressed) player.change_x(-5);
        if (rightPressed) player.change_x(5);

        if (!game_going) {
            if (jump_frames) {
                game_going = true;
                spawner = window.setInterval(generate_enemy, 1000);
            } else {
                return;
            }
        }

        for (platform of obstacles) {
            platform.y += SCROLL_SPEED;
        }

        player_stable = is_player_stable(player, obstacles);

        if(player.y <= 0){
            SCROLL_SPEED = 3;
        }else{
            SCROLL_SPEED = DEFAULT_SCROLL_SPEED;
        }

        var top = obstacles[obstacles.length - 1];
        if (top.y + top.height > canvas.height) {
            obstacles.pop();
        }

        if (jump_frames-- > 0) player.change_y(-jump_frames);

        if(player_stable)
            player.change_y(SCROLL_SPEED);
        else if (!player_stable)
            player.change_y(GRAVITY + SCROLL_SPEED);

        player.score++;
    }

    function clear_canvas(alpha) {
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clear_canvas(0.1);

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#0000FF";

        for (element of obstacles) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = "#09F000";

        ctx.fillText(
            'Score: ' + player.score,
            canvas.width - 110, 
            24
        );

        renderer = window.requestAnimationFrame(draw);
    }

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.font = '18px sans-serif';
    } else {
        alert("this browser has no canvas support");
        return;
    }

    function generate_enemy(){
        obstacles.unshift(make_obstacle(0));
    }

    for (var i = 0; i < canvas.height; i += 100) {
        obstacles.push(make_obstacle(i));
    }

    updater = window.setInterval(update, 10);
    generate_enemy();
    draw();
}

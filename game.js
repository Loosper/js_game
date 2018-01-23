window.onload = function(_) {
    class Obstacle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.height = 25;
            this.width = 100;
        }
    }

    var SCROLL_SPEED = 1;
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
            if (this.y + step < 0)
                this.y = 0;
            else if (this.y + this.height + step > canvas.height)
                this.y = canvas.height - this.height;
            else
                this.y += step;
        }
    }

    var obstacles = [];
    var leftPressed = false;
    var rightPressed = false;
    var jump_frames = 0;

    document.addEventListener("keydown", function(ev){
        console.log(ev.key);
        if (ev.key == 'ArrowLeft') leftPressed = true;
        else if (ev.key == 'ArrowRight') rightPressed = true;
        else if (ev.key == ' ') jump_frames = 20;
    });

    document.addEventListener("keyup", function(ev){
        if (ev.key == 'ArrowLeft') leftPressed = false;
        else if (ev.key == 'ArrowRight') rightPressed = false;
        // else if (ev.key == ' ') spacePressed = false;
    });

    function make_obstacle(y) {
        return new Obstacle(Math.floor(Math.random() * canvas.width), y);
    }

    function draw() {
        var player_stable = false;

        for (platform of obstacles) {
            platform.y += SCROLL_SPEED;

            if (player.standing(platform)) {
                player_stable = true;
            }
        }

        var top = obstacles[obstacles.length - 1];
        if (top.y + top.height > canvas.height) {
            obstacles.pop();
            obstacles.unshift(make_obstacle(0));
        }

        if (leftPressed) player.change_x(-5);
        if (rightPressed) player.change_x(5);
        if (jump_frames-- > 0) player.change_y(-4);

        if (!player_stable)
            player.change_y(GRAVITY);

        // render
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height, 0.5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "#0000FF";

        for (element of obstacles) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }

        window.requestAnimationFrame(draw);
    }

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        alert("this browser is bad");
        return;
    }

    for (var i = 0; i < canvas.height; i += 50) {
        obstacles.push(make_obstacle(i));
    }

    draw();
}

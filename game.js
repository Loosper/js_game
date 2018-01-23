window.onload = function(_) {
    class Obstacle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.height = 25;
            this.width = 100;
        }
    }

    var canvas = document.getElementById("canvas");
    var ctx;
    var player = {
        width: 50,
        height: 50,
        x: canvas.width / 2,
        y: canvas.height - 50
    }

    var gravity = 1;
    var obstacles = [];
    var leftPressed = false;
    var rightPressed = false;
    var jump_frames = 0;

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        alert("this browser is bad");
        return;
    }

    for (var i = 0; i < canvas.height; i += 50) {
        obstacles.push(
            new Obstacle(Math.floor(Math.random() * canvas.width), i)
        );
    }

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

    function draw() {
        if (leftPressed) player.x -= 5;
        if (rightPressed) player.x += 5;
        if (jump_frames-- > 0) player.y -= 4;

        // for (platform of obstacles) {
        //
        // }

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

    draw();
}

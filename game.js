window.onload = function(_) {
    class Obstacle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.height = 25;
            this.width = 100;
        }
    }

    var canvas = document.getElementById("tutorial");

    var player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 50,
        height: 50
    }

    var gravity = 1;

    var obstacles = [];
    for (var i = 0; i < 6; i++) {
        obstacles.push(new Obstacle(10 * i, 20 * i));
    }
    var leftPressed = false;
    var rightPressed = false;

    document.addEventListener("keydown", function(ev){
        console.log("down");
        var key = ev.keyCode;
            if(key == 37) leftPressed = true;
            if (key == 39) rightPressed = true;
            //if(key == 39) player.x += 5;
            //if(key == 39) player.x += 5;

    });

    document.addEventListener("keyup", function(ev){
        console.log("up");
        var key = ev.ketCode;
        rightPressed = false;
        leftPressed = false;
    });

    function draw() {
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
        } else {
            alert("this browser is bad");
            return;
        }

        if (leftPressed) player.x -= 5;
        if (rightPressed) player.x += 5;

        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height, 0.5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = "#0000FF";

        for (element in obstacles) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
        }

        window.requestAnimationFrame(draw);
    }

    draw();
}

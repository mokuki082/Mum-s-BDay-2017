var main = function() {
    var ballsRearranged = false;
    var phrase = "HAPPY BIRTHDAY MUM♥";
    var balls = [];
    var pop = new Audio("snd/pop.wav");
    var finish = new Audio("snd/tada.wav");
    finish.loop = false;
    var backgroundMusic = new Audio("snd/bass.mp3");


    // Generate ball objects
    function init() {
        // Generate a list of balls
        var spacesEncountered = 0;

        var randomRGB = function(low=0, high=255) {
            return Math.round(Math.random() * (high-low) + low);
        }
        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i] == " ") {
                spacesEncountered++;
                continue;
            }
            var ball = document.createElement("div");
            ball.className = "ball";
            ball.id = "ball" + (i - spacesEncountered);
            // TODO: Different color sets
            ball.style.backgroundColor = "rgb(" + randomRGB(25,255) + ',' +
                                                79 + ',' +
                                                79 + ")";
            var str = document.createTextNode(phrase[i]);
            ball.appendChild(str);
            document.getElementById("container").appendChild(ball);
            balls.push(ball);
        }
    }

    // Ball Bouncing animation
    function ballBounce(ball) {
        vInit = 0;
        acc = 0.001;
        dist = (window.innerHeight - 60) - ball.style.top.slice(0,-2);
        var vFinal = Math.sqrt(vInit*vInit + 2*acc*dist);
        var time = Math.round((vFinal - vInit)/acc);

        $(ball).animate({
            top:"+=" + dist
        }, time, "easeOutBounce", function() {
            // if last ball is clicked, rearrange all balls
            if (ballId == balls.length) { // last ball
                rearrangeBalls();
            }
        });
    }

    // Move individual ball to a specified xy coordinate
    function moveBall(ballId, x, y) {
        $(document.getElementById('ball'+ballId)).animate({
            left: x,
            top: y
        },500, "easeInQuad", function() {
            if (ballId == balls.length - 1) { // last ball
                finish.play();
            }
        });
    }

    // Rearrange balls into "Happy Birthday Mum"
    function rearrangeBalls() {
        ballsRearranged = true;
        words = phrase.split(" ");
        var containerHeight = document.getElementById("container").offsetHeight;
        var containerWidth = document.getElementById("container").offsetWidth;
        var lineHeight = containerHeight / words.length;
        var ballId = 0;
        var xs = []
        var ys = []
        for (i in words) {
            for (j in words[i]) {
                var x = j * 150 + (containerWidth - 8 * 150)/2;
                var y = i * lineHeight + (lineHeight  - 120)/2;
                moveBall(ballId, x, y);
                ballId++;
            }
        }

    }

    function bounceAllBalls() {
        for (id in balls) {
            ballBounce(balls[id]);
        }
    }

    // Make Balls appear at cursor position when clicked
    var ballId = 0;
    var clickAnywhere = document.getElementById("clickAnywhere");
    var stopOnClick = false;
    document.onclick = function() {
        // Set click anywhere to hidden when first clicked
        if (clickAnywhere.style.visibility != "hidden") {
            clickAnywhere.style.visibility = "hidden";
            backgroundMusic.play();
            backgroundMusic.loop = true;
        }
        if (!stopOnClick) {
            if (ballId == balls.length) {
                dropBall = false;
                stopOnClick = true;
            }
            pop.play();
            var ball = document.getElementById('ball'+ballId);
            // Pop Out Animation
            ball.style.top = event.clientY + 'px';
            ball.style.left = event.clientX + 'px';
            $(ball).animate({
                top:'-=60',
                left:'-=60',
                width:"+=120",
                height:"+=120",
                fontSize:"+=60"
            },500, "easeOutQuad");
            // Bounce animation
            ballBounce(ball);
            ballId++;
        }
    }; // end document onclick

    window.onresize = function() {
        if (!ballsRearranged) {
            for (id in balls) {
                var ball = balls[id];
                ball.style.top = window.innerHeight - 120 + 'px';
                if (ball.style.left.slice(0,-2) > window.innerWidth - 120) {
                    ball.style.left = window.innerWidth - 120 + 'px';
                }
            }
        }
    } // end of window.onresize

    init();
}

$(document).ready(main);

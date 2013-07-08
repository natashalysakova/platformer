var myGame = {
    STEP_DISTANCE: 18000,
    STEP_DISTANCE_ON_AIR: 25000,
    JUMP_ALTITUDE: 150000,
    LIVES: 3,
    MOVE_POINTS: 10,
    TIME_FRAME: 5,
    TIME_COST: 25,
    INITIAL_SCORE: 1000,
    score: 0,
    currentLevel: 0,
    lives: 3,
    //time: 2000,
    levels: [],
    startTime: 0,
    lastUpdate: 0,
    elapsedTime: 0
}

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

LEFT = 65;
RIGHT = 68;
JUMP = 87;

myGame.levels[0] = [
    { "type": "person", "x": 750, "y": 500 },
    { "type": "win", "width": 20, "height": 30, "x": 100, "y": 210, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 100, "height": 10, "x": 100, "y": 250, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 80, "height": 10, "x": 400, "y": 120, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 100, "height": 10, "x": 500, "y": 220, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 760, "y": 300, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 700, "y": 410, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 99, "height": 10, "x": 980, "y": 500, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 100, "height": 10, "x": 600, "y": 520, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 90, "height": 10, "x": 750, "y": 600, "rotation": 0, "friction": 0 }
];

myGame.levels[1] = [
    { "type": "person", "x": 750, "y": 500 },
    { "type": "win", "width": 20, "height": 30, "x": 100, "y": 210, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 80, "height": 10, "x": 100, "y": 250, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 80, "height": 10, "x": 350, "y": 300, "rotation": -20, "friction": 0.1 },
    { "type": "platform", "width": 50, "height": 10, "x": 530, "y": 350, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 760, "y": 300, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 720, "y": 410, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 99, "height": 10, "x": 980, "y": 500, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 100, "height": 10, "x": 600, "y": 520, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 90, "height": 10, "x": 750, "y": 600, "rotation": -10, "friction": 0 }
];
myGame.levels[2] = [
    { "type": "person", "x": 420, "y": 50 },
    { "type":      "win", "width": 20, "height": 30, "x": 950, "y": 210, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 100, "height": 10, "x": 900, "y": 250, "rotation": 0, "friction": 0},
    { "type": "platform", "width": 80, "height": 10, "x": 400, "y": 120, "rotation": -20, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 130, "y": 400, "rotation": 20, "friction": 0 },
    { "type": "platform", "width": 40, "height": 10, "x": 680, "y": 300, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 50, "height": 10, "x": 350, "y": 500, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 80, "height": 10, "x": 570, "y": 420, "rotation": 0, "friction": 0 },
    { "type": "platform", "width": 30, "height": 10, "x": 600, "y": 50, "rotation": -40, "friction": 0 }
];


$(function() {
    $(document).keydown(function(e) {
        var isFlying = isOnAir();
        switch(e.keyCode) {
            case LEFT: // left - a
                movePerson(LEFT, isFlying);
                break;

            case RIGHT: // right - d
                movePerson(RIGHT, isFlying);
                break;

            case JUMP: //up - w

                if (!isFlying) {
                    goDown(myGame.JUMP_ALTITUDE * -1); //negative, so we JUMP
                } else {
                    goDown(100000);
                }
                myGame.person.lastPressedKey = JUMP;
                break;
        }

    });

    $(document).keyup(function(e) {
        myGame.person.lastReleasedKey = e.keyCode;
        myGame.person.SetLinearVelocity(new b2Vec2(0, 500));
        myGame.person.SetAngularVelocity(0);
    });

    // get the reference of the context
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    canvasWidth = parseInt(canvas.width);
    canvasHeight = parseInt(canvas.height);



    restartGame(myGame.currentLevel);
    drawWorld(myGame.world, ctx);
    // start advancing the step

    $(".counter").flipCounter({
        number:0, // the initial number the counter should display, overrides the hidden field
        numIntegralDigits:4, // number of places left of the decimal point to maintain
        digitHeight:40, // the height of each digit in the flipCounter-medium.png sprite image
        digitWidth:30, // the width of each digit in the flipCounter-medium.png sprite image
        imagePath:"images/flipCounter-medium.png", // the path to the sprite image relative to your html document
        easing: false, // the easing function to apply to animations, you can override this with a jQuery.easing method
        duration:1000 // duration of animations
    });
    myGame.score = myGame.INITIAL_SCORE;
    $("#counterTime").flipCounter("setNumber", 0);
    $("#counterScore").flipCounter("setNumber", myGame.score);

    $("#counterLives").flipCounter("setNumber", myGame.lives);
    $("#counterLevels").flipCounter("setNumber", myGame.levels.length - myGame.currentLevel);

    var currentTime = new Date();
    myGame.lastUpdate = myGame.startTime = currentTime.getTime();
    step();
});

function restartGame(level) {
    myGame.currentLevel = level;
    myGame.world = createWorld();
    myGame.lava = createGround(800, 25, 550, 670, 0);//base - lava


    for (var i = 0; i < myGame.levels[level].length; i++) {
        var obj = myGame.levels[level][i];

        if (obj.type == "platform") {
            createGround(obj.width, obj.height, obj.x, obj.y, obj.rotation, obj.friction);
        } else if (obj.type == "person") {
            myGame.person = createPersonAt(obj.x, obj.y);
        } else if (obj.type == "win") {
            myGame.win = createGround(obj.width, obj.height, obj.x, obj.y, obj.rotation, obj.friction);
        }
    }

}

function createPersonAt(x, y) {
    // create a box
    var boxSd = new b2BoxDef();
    boxSd.density = 0.1;
    boxSd.friction = 0;
    boxSd.restitution = 0;
    boxSd.extents.Set(20, 40);

    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x, y);
    boxBd.preventRotation = true;

    return myGame.world.CreateBody(boxBd);
}

function createWorld() {
    // set the size of the world
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-4000, -4000);
    worldAABB.maxVertex.Set(4000, 4000);
    // Define the gravity
    var gravity = new b2Vec2(0, 300);
    // set to ignore sleeping object
    var doSleep = false;
    // finally create the world with the size, gravity, and sleep object parameter.
    var world = new b2World(worldAABB, gravity, doSleep);

    return world;
}

function createGround(width, height, positionX, positionY, rotation, friction) {
    // box shape definition
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(width, height);
    groundSd.restitution = 0;
    groundSd.friction = friction;

    // body definition with the given shape we just created.
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(positionX, positionY);
    groundBd.rotation = rotation * Math.PI / 180;
    var body = myGame.world.CreateBody(groundBd);
    return body;
}

// drawing functions
function drawWorld(world, context) {
    for (var b = world.m_bodyList; b != null; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            drawShape(s, context);
        }
    }
}

// drawShape function directly copy from draw_world.js in Box2dJS library
function drawShape(shape, context) {
    context.strokeStyle = '#003300';
    context.beginPath();
    switch (shape.m_type) {
        case b2Shape.e_circleShape:
            var circle = shape;
            var pos = circle.m_position;
            var r = circle.m_radius;
            var segments = 16.0;
            var theta = 0.0;
            var dtheta = 2.0 * Math.PI / segments;
            // draw circle
            context.moveTo(pos.x + r, pos.y);
            for (var i = 0; i < segments; i++) {
                var d = new b2Vec2(r * Math.cos(theta),
                    r * Math.sin(theta));
                var v = b2Math.AddVV(pos, d);
                context.lineTo(v.x, v.y);
                theta += dtheta;
            }
            context.lineTo(pos.x + r, pos.y);
            // draw radius
            context.moveTo(pos.x, pos.y);
            var ax = circle.m_R.col1;
            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
            context.lineTo(pos2.x, pos2.y);
            break;
        case b2Shape.e_polyShape:
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position,
                b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            context.moveTo(tV.x, tV.y);
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position,
                    b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                context.lineTo(v.x, v.y);
            }
            context.lineTo(tV.x, tV.y);
    break;
    }
    context.stroke();
}

function step() {
    myGame.world.Step(1.0/60, 1);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawWorld(myGame.world, ctx);
    setTimeout(step, 20);

    var currentTime = new Date();
    currentTime = currentTime.getTime();
    if ((currentTime - myGame.lastUpdate) > 1000) {
        $("#counterTime").flipCounter("setNumber", ++myGame.elapsedTime);
        myGame.lastUpdate = currentTime;
        if (!(myGame.elapsedTime % myGame.TIME_FRAME)) {
            myGame.score -= myGame.TIME_COST;

        }
        if (myGame.score < 1) {
            alert("Game Over. Either you made too much moves or you ran out of time");
            $("#counterScore").flipCounter("setNumber", 0);
            gameOver();
        }
        $("#counterScore").flipCounter("setNumber", myGame.score);
    }


    for (var cn = myGame.world.GetContactList(); cn != null; cn = cn.GetNext()) {
        var body1 = cn.GetShape1().GetBody();
        var body2 = cn.GetShape2().GetBody();

        if (body1 == myGame.lava || body2 == myGame.lava) { //character is on lava,
            myGame.world.DestroyBody(myGame.person);

            if (myGame.lives == 0) {
                alert("Game Over");
                gameOver();
            } else {
                myGame.lives--;
                alert("you failed! lets try again");
                $("#counterLives").flipCounter("setNumber", myGame.lives);
                $("#counterLevels").flipCounter("setNumber", myGame.levels.length - myGame.currentLevel);
                restartGame(myGame.currentLevel);
            }
        } else if ((body1 == myGame.person && body2 == myGame.win) ||
            (body1 == myGame.win && body2 == myGame.person)) {
                var totalLevels = myGame.levels.length;
                myGame.currentLevel++;
                if (myGame.currentLevel == totalLevels) {
                    alert("You have won the game");
                    gameOver();
                    restartGame(0);
                } else if (myGame.currentLevel < totalLevels) {
                    restartGame(myGame.currentLevel);
                }
        }
    }
}


function gameOver() {
    myGame.currentLevel =  myGame.lastUpdate = myGame.elapsedTime = 0;
    myGame.score = myGame.INITIAL_SCORE;
    myGame.lives = myGame.LIVES;
    $("#counterTime").flipCounter("setNumber", myGame.elapsedTime);
    $("#counterScore").flipCounter("setNumber", myGame.score);
    $("#counterLives").flipCounter("setNumber", myGame.lives);
    $("#counterLevels").flipCounter("setNumber", myGame.levels.length - myGame.currentLevel);
    restartGame(0);
}

function movePerson(direction, isFlying) {
    myGame.person.currentStepDistance = (isFlying? myGame.STEP_DISTANCE_ON_AIR : myGame.STEP_DISTANCE);
    /*console.log("-------------------------------");
    console.log("flying: " + isFlying);
    console.log("direction: " + direction);
    console.log("released: " + myGame.person.lastReleasedKey);
    console.log("pressed: " + myGame.person.lastPressedKey);
    console.log("-------------------------------");*/

    //if (isFlying && (myGame.person.lastReleasedKey == direction && myGame.person.lastPressedKey == direction)) {
    if (isFlying && (myGame.person.lastPressedKey == direction)) {

        return;
    }
    if (direction == RIGHT) {
        var vector = new b2Vec2(myGame.person.currentStepDistance / 100,0);
    } else if (direction == LEFT) {
        var vector = new b2Vec2(myGame.person.currentStepDistance * -1 / 100,0);
    }
    myGame.score -= myGame.MOVE_POINTS;
    $("#counterScore").flipCounter("setNumber", myGame.score);
    myGame.person.SetLinearVelocity(vector);
    myGame.person.lastPressedKey = direction;
}

function isOnAir() {
    var x = Math.abs(myGame.person.GetLinearVelocity().x);
    var y = myGame.person.GetLinearVelocity().y;
    var list = myGame.world.GetContactList();

    if (list == null) {
        //console.log("on air");
        return true;
    } else {
        //console.log("      touching ground");
        return false;
    }
    console.log("X: " + x + " Y: " + y);
    //return !(x == 0 && y == 0 || (x == MyGame.STEP_DISTANCE / 100));
    if (myGame.person.currentStepDistance === undefined) {
        myGame.person.currentStepDistance = myGame.STEP_DISTANCE;
    }
    //console.log("step " + myGame.person.currentStepDistance);
    //console.log("/////");
    if (x == 0 && y == 0 ||
        (x == myGame.person.currentStepDistance / 100 && y == 0) ||
        (list !== null)
        ) {
        return false;
    } //else if () {
    console.log("on air");
    return true;
    //}
}

function goDown(magnitude) {
    var impulse = new b2Vec2(0, magnitude);
    myGame.person.ApplyImpulse(impulse, myGame.person.GetCenterPosition());
}

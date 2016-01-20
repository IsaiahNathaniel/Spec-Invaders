var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// main state of game
var mainState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#71c5cf';
        // load bird asset
        game.load.image('bird', 'assets/bird.png');    
        game.load.image('pipe', 'assets/pipe.png');
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // display bird
        this.bird = this.game.add.sprite(100, 245, 'bird');
        // add gravity to bird
        game.physics.arcade.enable(this.bird)
        this.bird.body.gravity.y = 1000;
        // jump function
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        // pipes
        this.pipes = game.add.group(); //create a group
        this.pipes.enableBody = true; // add physics
        this.pipes.createMultiple(20, 'pipe');
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); // game timer
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    },
    
    // called 60 times per second contains games logic
    update: function() {
        // checks for world leaving
        if (this.bird.inWorld == false)
            this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    },
    jump: function() {
        //adds vertical velocity
        this.bird.body.velocity.y = -350;
    },
    restartGame: function() {
        // Restarts gamae
        game.state.start('main')
    },
    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead(); //gets first dead
        pipe.reset(x, y); //set new position of pipe
        pipe.body.velocity.x = -200; // make it move to the left
        // kill when no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        // Pick floor hole.
        var hole = Math.floor(Math.random() * 5) + 1;
        // add 6 pipes
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1 && i != hole + 2)
                this.addOnePipe(400, i * 65 + 10);
        this.score += 1;
        this.labelScore.text = this.score;
        
    }
};

game.state.add('main', mainState);
game.state.start('main');


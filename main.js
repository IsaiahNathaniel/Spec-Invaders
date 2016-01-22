var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// main state of game
var mainState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#1b1b18';
        // load asset
        game.load.image('player', 'assets/invader.png');    
        game.load.image('baddie', 'assets/baddie.png');
        game.load.image('projectile', 'assets/projectile.png');
        game.load.image('spacebackground', 'assets/background.png');
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //load tilesprite (aka background)
        this.spaceSprite = game.add.tileSprite(0,0, 800, 600, 'spacebackground')
        
        // display ship
        this.player = this.game.add.sprite(400, 550, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5); // where the "middle" of the player is
      
        // creating the enemies in a group
        this.baddies = game.add.group(); 
        this.baddies.enableBody = true; // enables collision
        this.baddies.physicsBodyType = Phaser.Physics.ARCADE;
        this.baddies.setAll('anchor.x', 0.5); // needed for collision info
        this.baddies.setAll('anchor.y', 0.5);
        this.baddies.collideWorldBounds=true; // so player can't leave the screen
        
        
        // creating the projectiles being shot from our player
        this.projectiles = game.add.group();
        this.projectiles.enableBody = true; // enables collision
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.projectiles.createMultiple(30, 'projectile') // create alot of projectiles (we will re-use the projectiles in order to save on space)
        this.projectiles.setAll('outOfBoundsKill', true); // kill if bullets leave screen
        this.projectiles.setAll('checkWorldBounds', true); // allow bullets to detect edges
        this.projectiles.setAll('anchor.x', 0.5); // this is needed for collision information
        this.projectiles.setAll('anchor.y', 1);
        
        
        //this next function will be called from below and create the baddies
        this.createBaddies();
        
        // setting the variable movement to a pre-packaged input set, bound to cursor keys.
        this.movement = game.input.keyboard.createCursorKeys();
        
        // uses phasers built in event listener(basically checks for input) to bind to space
        this.fireProjectile = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        // score keeping
        
        this.score = 0;
        this.scoreLabel = 'Points : ';
        this.labelScore = game.add.text(20, 20, this.scoreLabel + this.score, { font: "20px Arial", fill: "#ffffff" });
        
        // timer variable set to 0, this is to ensure we dont shoot too fast, so I will fully explain how this works when i use it
         
        this.checkFireRate = 0;
        
        // variable to make the program easier to read, changing velocity of the projectile according to players current velocity
        
        this.projectileVelocity = this.player.body.velocity.x;
        
    },
    
    // called 60 times per second contains games logic
    update: function() {
    
        // background movement
        this.spaceSprite.tilePosition.y -= 2;
        
        // collision detection
        
        this.game.physics.arcade.overlap(this.projectiles, this.baddies, this.projectileCollisionEvent, null, this)
        
        
        
        // constantly sets velocity to 0, needed because we used velocity changes as our method of movement, this makes it so the player doesn't keep sliding in one direction
        this.player.body.velocity.setTo(0,0);
        
        // if left cursor is down, go left, if right is down, go right. uses velocity from this frameworks built-in physics
        if (this.movement.left.isDown){
            this.player.body.velocity.x = -200;
        }
        else if (this.movement.right.isDown){
            this.player.body.velocity.x = 200;
        }
        
        // basically says if space key is pressed then run the shootProjectile function
        if (this.fireProjectile.isDown){
            this.shootProjectile();
        }
                                                  
        if (this.baddies.x > 0 && this.baddies.x < 20) {
            
            this.baddiesMoveRight();
            
        }
        
        if (this.baddies.x > 780 && this.baddies.x < 800) {
            
            this.baddiesMoveLeft();
            
        }
        
        if (this.baddies.y == 360) {
            this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseText = 'Bummer, you lost! \n Click the screen to continue!'
            this.loseDisplay = game.add.text(250, 250, this.loseText, { font: "30px Arial", fill: "#ffffff" });
        }
        
        if (this.baddies.countLiving() == 0) {
            this.game.input.onTap.addOnce(this.restartGame, this);
            this.winText = 'Congrats, you won! \n Click the screen to continue!'
            this.wonDisplay = game.add.text(250, 250, this.winText, { font: "30px Arial", fill: "#ffffff" });


        }
        
        // console.log(this.baddies.y)
        
    },
    
    // to best explain this, i will simply speak as if i am the program.
    // if the game time is more than the last time we fired plus 400 milliseconds then create a new projectile from our group, grab the first one that isn't being used from our pool of bullets ( we do this to save processing space )
    // if this new projectile is spawned and is true then set its location to the player, give it a velocity of -400 to propel it upwards, set its x velocity to half of the players, then set the checkFireRate variable to the game time plus 400 milliseconds so the bullet cannot be shot again until the game clock reaches that moment.
    
    shootProjectile: function() {
        
        if (this.game.time.now > this.checkFireRate) {
            
            this.newProjectile = this.projectiles.getFirstExists(false);
            
            if (this.newProjectile) {
                
                this.newProjectile.reset(this.player.x, this.player.y - 20);
                this.newProjectile.body.velocity.y = -400;
                this.newProjectile.body.velocity.x = (this.player.body.velocity.x / 2);
                this.checkFireRate = this.game.time.now + 600;
                
            }
            
        }
        
    },
    
    createBaddies: function() {
        // add an array of sorts of baddies
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 6; x++){
                this.baddies.create(x * 90,y * 50, 'baddie');
            }
        }
        
        this.baddies.x = 70;
        this.baddies.y = 50;
        
        // alright, so this is a little hard to explain, but this is a tween, basically it helps with fluid animation, and in this case, is moving our baddies back and forth, I'm actually going to break up each part on a seperate line and explain it
        var screenMovement = game.add.tween(this.baddies).to(
            { x: 200 },  // we are going to be moving the entire group of baddies to the x position of 200 from its current position
            2000, // it should take 2000 milliseconds for it to reach each side
            Phaser.Easing.Linear.None,  // this is the rate or style of change, we have it set to being casual
            true, // this enables autostart
            0,  // there is no delay, so this parameter is 0
            1000, // repeat this 1000 times
            true // this enables "yoyo'ing" basically, when our tween is done, this reverses it and plays it backwards
        );
        
        screenMovement.onLoop.add(this.baddiesMoveDown, this);
    },
    
    baddiesMoveDown: function() {
        
        this.baddies.y += 10;
        
    },
        
    baddiesMoveRight: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    baddiesMoveLeft: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    // function called if a projectile and baddie collide
    projectileCollisionEvent: function(projectileCol, baddieCol) {
        
        // First lets increase the score.
        this.score += 1;
        
        this.labelScore.text = this.scoreLabel + this.score;
        
        // Let's get rid of both the bullet and the alien that was hit
        projectileCol.kill();
        baddieCol.kill();
        
        
    },
    
    restartGame: function() {
        // Restarts game
        game.state.start('main')
    },
};

game.state.add('main', mainState);
game.state.start('main');


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

var titleState = {
    
    preload: function() {
        game.load.image('player', 'assets/invader.png');    
        game.load.image('baddie', 'assets/baddie.png');
        game.load.image('projectile', 'assets/projectile.png');
        game.load.image('spacebackground', 'assets/background.png');
        game.load.image('muteButton', 'assets/muteButton.png')
        game.load.image('rocket', 'assets/rocket.png')
        game.load.image('easyButton', 'assets/easyButton.png')
        game.load.image('mediumButton', 'assets/mediumButton.png')
        game.load.image('hardButton', 'assets/hardButton.png')
        game.load.audio('shootProjectile', 'assets/Sounds/shootProjectile.mp3')
        game.load.audio('baddieDeath', 'assets/Sounds/baddieGoBoom.mp3')
        game.load.audio('gameMusic', 'assets/Sounds/gameMusic.mp3')
    },
    
    create: function() {
        this.spaceSprite = game.add.tileSprite(0,0, 800, 600, 'spacebackground')
        this.startGameButton = game.add.button(300, 220, 'easyButton', this.startGame, this);
        this.startGameButton2 = game.add.button(300, 280, 'mediumButton', this.startMediumGame, this);
        this.startGameButton3 = game.add.button(300, 340, 'hardButton', this.startHardGame, this);
        this.movement = game.input.keyboard.createCursorKeys();
        this.fireProjectile = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.player = this.game.add.sprite(400, 550, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5);
        // this.score = "Your Score Goes Here!"
        // this.scoreLabel = 'Points : ';
        // this.labelScore = game.add.text(20, 20, this.scoreLabel + this.score, { font: "20px Arial", fill: "#ffffff" });
        this.muteButton = game.add.button(755, 10, 'muteButton', this.muteSound, this);
        this.muteButton.alpha = .3;
        this.sound = true;
        this.textBox = game.add.text(210, 500, "This is your laser!\nPress the arrows keys to move left and right.\nPress space to shoot. (Not Yet.)", { font: "10px Arial", fill: "#ffffff" });
        this.startGameButton.onInputOver.add(this.highlightButton, this);
        this.startGameButton2.onInputOver.add(this.highlightButton2, this);
        this.startGameButton3.onInputOver.add(this.highlightButton3, this);
        this.startGameButton.onInputOut.add(this.dehighlightButton, this);
        this.startGameButton2.onInputOut.add(this.dehighlightButton2, this);
        this.startGameButton3.onInputOut.add(this.dehighlightButton3, this);
    },
    
    update: function() {
        this.spaceSprite.tilePosition.y -= 2;
        this.player.body.velocity.setTo(0,0);
        if (this.movement.left.isDown){
            this.player.body.velocity.x = -200;
        }
        else if (this.movement.right.isDown){
            this.player.body.velocity.x = 200;
        }

        
    },
    
    startGame: function() {
      
        game.state.start('main');
        
    },
    
    startMediumGame: function() {
        game.state.start('medium')
    },
    
    startHardGame: function() {
        game.state.start('hard')  
    },
    
    muteSound: function() {
        
        if (this.sound == true) {
            this.sound = false;
            this.muteButton.alpha = 1.5;
        }
        
        else {
            this.sound = true;
            this.muteButton.alpha = .3;
        }
    },
    highlightButton: function() {
        this.startGameButton.alpha = .3;
    },
    highlightButton2: function() {
        this.startGameButton2.alpha = .3;
    },
    highlightButton3: function() {
        this.startGameButton3.alpha = .3;
    },
    dehighlightButton: function() {
        this.startGameButton.alpha = 1;
    },
    dehighlightButton2: function() {
        this.startGameButton2.alpha = 1;
    },
    dehighlightButton3: function() {
        this.startGameButton3.alpha = 1;
    },
    
};

// main state of game
var mainState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#1b1b18';
        // load asset
        /*
        game.load.image('player', 'assets/invader.png');    
        game.load.image('baddie', 'assets/baddie.png');
        game.load.image('projectile', 'assets/projectile.png');
        game.load.image('spacebackground', 'assets/background.png');
        game.load.image('muteButton', 'assets/muteButton.png')
        game.load.image('rocket', 'assets/rocket.png')
        game.load.audio('shootProjectile', 'assets/Sounds/shootProjectile.mp3')
        game.load.audio('baddieDeath', 'assets/Sounds/baddieGoBoom.mp3')
        game.load.audio('gameMusic', 'assets/Sounds/gameMusic.mp3')
    */
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //load tilesprite (aka background)
        this.spaceSprite = game.add.tileSprite(0,0, 800, 600, 'spacebackground')
        
        // set up sounds
        this.sound = true;
        this.projectileSound = game.add.audio('shootProjectile');
        this.baddieDeathSound = game.add.audio('baddieDeath')
        this.gameMusic = game.add.audio('gameMusic')
        
        // this.gameMusic.play();
        
        // display ship
        this.player = this.game.add.sprite(400, 550, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5); // where the "middle" of the player is
        this.player.collideWorldBounds=true;
      
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
        
        // rockets (experimental game)
        this.rockets = game.add.group();
        this.rockets.enableBody = true;
        this.rockets.physicsBodyType = Phaser.Physics.ARCADE;
        this.rockets.createMultiple(10, 'rocket')
        this.rockets.setAll('outOfBoundsKill', true); 
        this.rockets.setAll('checkWorldBounds', true); 
        this.rockets.setAll('anchor.x', 0.5); 
        this.rockets.setAll('anchor.y', 0.5);
        
        
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
        // added a second one to it for the rockets that im testing
         
        this.checkFireRate = 0;
        this.rocketFreq = 0;
        
        // variable to make the program easier to read, changing velocity of the projectile according to players current velocity
        
        this.projectileVelocity = this.player.body.velocity.x;
        
        // button testing for controls
        this.muteButton = game.add.button(755, 10, 'muteButton', this.muteSound, this);
        this.muteButton.alpha = .3;
        
    },
    
    // called 60 times per second contains games logic
    update: function() {
    
        // background movement
        this.spaceSprite.tilePosition.y -= 1;
        
        // projectile - baddie
        
        this.game.physics.arcade.overlap(this.projectiles, this.baddies, this.projectileCollisionEvent, null, this)
        
        // rocket - player
        
        this.game.physics.arcade.overlap(this.player, this.rockets, this.playerHit, null, this)

        
        
        if (this.player.alive) {
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
        
        if (game.time.now > this.rocketFreq) {
            
            this.fireRocket();
            
        }
                                                  
        if (this.baddies.x > 0 && this.baddies.x < 20) {
            
            this.baddiesMoveRight();
            
        }
        
        if (this.baddies.x > 780 && this.baddies.x < 800) {
            
            this.baddiesMoveLeft();
            
        }
            
        }
        
        if (this.baddies.y == 360) {
            this.baddies.callAll('kill');
            this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseText = 'Bummer, you lost! \n Click the screen to continue!'
            this.loseDisplay = game.add.text(250, 250, this.loseText, { font: "30px Arial", fill: "#ffffff" });
        }
        
        if (this.baddies.countLiving() == 0 && this.baddies.y < 359) {
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
                
                if (this.sound) {
                    this.projectileSound.play();
                }
                
            }
            
        }
        
        },
    
    fireRocket: function() {
        
        this.newRocket = this.rockets.getFirstExists(false);
        
        if (this.newRocket) {
            
            this.random = game.rnd.integerInRange(200, 600);
            
            this.randomSec = game.rnd.integerInRange(650, 1500)
            
            this.newRocket.reset(this.random, 10);
            
            game.physics.arcade.moveToObject(this.newRocket, this.player, 140);
            
            this.rocketFreq = game.time.now + this.randomSec;
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
            2500, // it should take 2000 milliseconds for it to reach each side
            Phaser.Easing.Linear.None,  // this is the rate or style of change, we have it set to being casual
            true, // this enables autostart
            0,  // there is no delay, so this parameter is 0
            1000, // repeat this 1000 times
            true // this enables "yoyo'ing" basically, when our tween is done, this reverses it and plays it backwards
        );
        
        screenMovement.onLoop.add(this.baddiesMoveDown, this);
    },
    
    baddiesMoveDown: function() {
        
        this.baddies.y += 8;
        
    },
        
    baddiesMoveRight: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    baddiesMoveLeft: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    // function called if a projectile and baddie collide
    projectileCollisionEvent: function(projectileCol, baddieCol) {
        
        if (this.sound) {
        this.baddieDeathSound.play();
        }
            
        // First lets increase the score.
        this.score += 1;
        
        this.labelScore.text = this.scoreLabel + this.score;
        
        // Let's get rid of both the bullet and the alien that was hit
        projectileCol.kill();
        baddieCol.kill();
        
        
    },
    
    playerHit: function(playerCol, rocketCol) {
        
        if (this.sound) {
            this.baddieDeathSound.play();
        }
        
        playerCol.kill();
        rocketCol.kill();
        
        
        this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseTextToRocket = ' Bummer, you lost. \n Come on, you are on easy!\n Click the screen to continue!'
            this.loseDisplayToRocket = game.add.text(100, 250, this.loseTextToRocket, { font: "30px Arial", fill: "#ffffff" });
        
        
        
    },
    
    muteSound: function() {
        
        if (this.sound == true) {
            this.sound = false;
            this.muteButton.alpha = 1.5;
        }
        
        else {
            this.sound = true;
            this.muteButton.alpha = .3;
        }
           
    },
    
    restartGame: function() {
        // Restarts game
        game.state.start('main')
    },
};





var mediumState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#1b1b18';
        // load asset
        /*
        game.load.image('player', 'assets/invader.png');    
        game.load.image('baddie', 'assets/baddie.png');
        game.load.image('projectile', 'assets/projectile.png');
        game.load.image('spacebackground', 'assets/background.png');
        game.load.image('muteButton', 'assets/muteButton.png')
        game.load.image('rocket', 'assets/rocket.png')
        game.load.audio('shootProjectile', 'assets/Sounds/shootProjectile.mp3')
        game.load.audio('baddieDeath', 'assets/Sounds/baddieGoBoom.mp3')
        game.load.audio('gameMusic', 'assets/Sounds/gameMusic.mp3')
    */
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //load tilesprite (aka background)
        this.spaceSprite = game.add.tileSprite(0,0, 800, 600, 'spacebackground')
        
        // set up sounds
        this.sound = true;
        this.projectileSound = game.add.audio('shootProjectile');
        this.baddieDeathSound = game.add.audio('baddieDeath')
        this.gameMusic = game.add.audio('gameMusic')
        
        // this.gameMusic.play();
        
        // display ship
        this.player = this.game.add.sprite(400, 550, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5); // where the "middle" of the player is
        this.player.collideWorldBounds=true;
      
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
        
        // rockets (experimental game)
        this.rockets = game.add.group();
        this.rockets.enableBody = true;
        this.rockets.physicsBodyType = Phaser.Physics.ARCADE;
        this.rockets.createMultiple(10, 'rocket')
        this.rockets.setAll('outOfBoundsKill', true); 
        this.rockets.setAll('checkWorldBounds', true); 
        this.rockets.setAll('anchor.x', 0.5); 
        this.rockets.setAll('anchor.y', 0.5);
        
        
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
        // added a second one to it for the rockets that im testing
         
        this.checkFireRate = 0;
        this.rocketFreq = 0;
        
        // variable to make the program easier to read, changing velocity of the projectile according to players current velocity
        
        this.projectileVelocity = this.player.body.velocity.x;
        
        // button testing for controls
        this.muteButton = game.add.button(755, 10, 'muteButton', this.muteSound, this);
        this.muteButton.alpha = .3;
        
    },
    
    // called 60 times per second contains games logic
    update: function() {
    
        // background movement
        this.spaceSprite.tilePosition.y -= 2;
        
        // projectile - baddie
        
        this.game.physics.arcade.overlap(this.projectiles, this.baddies, this.projectileCollisionEvent, null, this)
        
        // rocket - player
        
        this.game.physics.arcade.overlap(this.player, this.rockets, this.playerHit, null, this)

        
        
        if (this.player.alive) {
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
        
        if (game.time.now > this.rocketFreq) {
            
            this.fireRocket();
            
        }
                                                  
        if (this.baddies.x > 0 && this.baddies.x < 20) {
            
            this.baddiesMoveRight();
            
        }
        
        if (this.baddies.x > 780 && this.baddies.x < 800) {
            
            this.baddiesMoveLeft();
            
        }
            
        }
        
        if (this.baddies.y == 360) {
            this.baddies.callAll('kill');
            this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseText = 'Bummer, you lost! \n Click the screen to continue!'
            this.loseDisplay = game.add.text(250, 250, this.loseText, { font: "30px Arial", fill: "#ffffff" });
        }
        
        if (this.baddies.countLiving() == 0 && this.baddies.y < 359) {
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
                
                if (this.sound) {
                    this.projectileSound.play();
                }
                
            }
            
        }
        
        },
    
    fireRocket: function() {
        
        this.newRocket = this.rockets.getFirstExists(false);
        
        if (this.newRocket) {
            
            this.random = game.rnd.integerInRange(0, 800);
            
            this.randomSec = game.rnd.integerInRange(200, 1000)
            
            this.newRocket.reset(this.random, 15);
            
            game.physics.arcade.moveToObject(this.newRocket, this.player, 120);
            
            this.rocketFreq = game.time.now + this.randomSec;
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
        
        if (this.sound) {
        this.baddieDeathSound.play();
        }
            
        // First lets increase the score.
        this.score += 1;
        
        this.labelScore.text = this.scoreLabel + this.score;
        
        // Let's get rid of both the bullet and the alien that was hit
        projectileCol.kill();
        baddieCol.kill();
        
        
    },
    
    playerHit: function(playerCol, rocketCol) {
        
        if (this.sound) {
            this.baddieDeathSound.play();
        }
        
        playerCol.kill();
        rocketCol.kill();
        
        
        this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseTextToRocket = 'Bummer, you lost. \n You are supposed to avoid those!\n Click the screen to continue!'
            this.loseDisplayToRocket = game.add.text(100, 250, this.loseTextToRocket, { font: "30px Arial", fill: "#ffffff" });
        
        
        
    },
    
    muteSound: function() {
        
        if (this.sound == true) {
            this.sound = false;
            this.muteButton.alpha = 1.5;
        }
        
        else {
            this.sound = true;
            this.muteButton.alpha = .3;
        }
           
    },
    
    restartGame: function() {
        // Restarts game
        game.state.start('medium')
    },
};




var hardState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#1b1b18';
        // load asset
        /*
        game.load.image('player', 'assets/invader.png');    
        game.load.image('baddie', 'assets/baddie.png');
        game.load.image('projectile', 'assets/projectile.png');
        game.load.image('spacebackground', 'assets/background.png');
        game.load.image('muteButton', 'assets/muteButton.png')
        game.load.image('rocket', 'assets/rocket.png')
        game.load.audio('shootProjectile', 'assets/Sounds/shootProjectile.mp3')
        game.load.audio('baddieDeath', 'assets/Sounds/baddieGoBoom.mp3')
        game.load.audio('gameMusic', 'assets/Sounds/gameMusic.mp3')
    */
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //load tilesprite (aka background)
        this.spaceSprite = game.add.tileSprite(0,0, 800, 600, 'spacebackground')
        
        // set up sounds
        this.sound = true;
        this.projectileSound = game.add.audio('shootProjectile');
        this.baddieDeathSound = game.add.audio('baddieDeath')
        this.gameMusic = game.add.audio('gameMusic')
        
        // this.gameMusic.play();
        
        // display ship
        this.player = this.game.add.sprite(400, 550, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5); // where the "middle" of the player is
        this.player.collideWorldBounds=true;
      
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
        
        // rockets (experimental game)
        this.rockets = game.add.group();
        this.rockets.enableBody = true;
        this.rockets.physicsBodyType = Phaser.Physics.ARCADE;
        this.rockets.createMultiple(25, 'rocket')
        this.rockets.setAll('outOfBoundsKill', true); 
        this.rockets.setAll('checkWorldBounds', true); 
        this.rockets.setAll('anchor.x', 0.5); 
        this.rockets.setAll('anchor.y', 0.5);
        
        
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
        // added a second one to it for the rockets that im testing
         
        this.checkFireRate = 0;
        this.rocketFreq = 0;
        
        // variable to make the program easier to read, changing velocity of the projectile according to players current velocity
        
        this.projectileVelocity = this.player.body.velocity.x;
        
        // button testing for controls
        this.muteButton = game.add.button(755, 10, 'muteButton', this.muteSound, this);
        this.muteButton.alpha = .3;
        
    },
    
    // called 60 times per second contains games logic
    update: function() {
        
        
        this.rocketCall = game.add.text(200, 20, this.randomSec, { font: "20px Arial", fill: "#ffffff" });
    
        // background movement
        this.spaceSprite.tilePosition.y -= 3;
        
        // projectile - baddie
        
        this.game.physics.arcade.overlap(this.projectiles, this.baddies, this.projectileCollisionEvent, null, this)
        
        // rocket - player
        
        this.game.physics.arcade.overlap(this.player, this.rockets, this.playerHit, null, this)

        
        
        if (this.player.alive) {
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
        
        if (game.time.now > this.rocketFreq) {
            
            this.fireRocket();
            
        }
                                                  
        if (this.baddies.x > 0 && this.baddies.x < 20) {
            
            this.baddiesMoveRight();
            
        }
        
        if (this.baddies.x > 780 && this.baddies.x < 800) {
            
            this.baddiesMoveLeft();
            
        }
            
        }
        
        if (this.baddies.y == 360) {
            this.baddies.callAll('kill');
            this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseText = 'Bummer, you lost! \n Click the screen to continue!'
            this.loseDisplay = game.add.text(250, 250, this.loseText, { font: "30px Arial", fill: "#ffffff" });
        }
        
        if (this.baddies.countLiving() == 0 && this.baddies.y < 359) {
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
                
                if (this.sound) {
                    this.projectileSound.play();
                }
                
            }
            
        }
        
        },
    
    fireRocket: function() {
        
        this.newRocket = this.rockets.getFirstExists(false);
        
        if (this.newRocket) {
            
            this.random = game.rnd.integerInRange(0, 800);
            
            this.randomSec = game.rnd.integerInRange(0, 200)
            
            this.newRocket.reset(this.random, 10);
            
            game.physics.arcade.moveToObject(this.newRocket, this.player, 100);
            
            this.rocketFreq = game.time.now + this.randomSec;
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
            1700, // it should take 2000 milliseconds for it to reach each side
            Phaser.Easing.Linear.None,  // this is the rate or style of change, we have it set to being casual
            true, // this enables autostart
            0,  // there is no delay, so this parameter is 0
            1000, // repeat this 1000 times
            true // this enables "yoyo'ing" basically, when our tween is done, this reverses it and plays it backwards
        );
        
        screenMovement.onLoop.add(this.baddiesMoveDown, this);
    },
    
    baddiesMoveDown: function() {
        
        this.baddies.y += 15;
        
    },
        
    baddiesMoveRight: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    baddiesMoveLeft: function() {
        
        // reserved method for future use (maybe)
        
    },
    
    // function called if a projectile and baddie collide
    projectileCollisionEvent: function(projectileCol, baddieCol) {
        
        if (this.sound) {
        this.baddieDeathSound.play();
        }
            
        // First lets increase the score.
        this.score += 1;
        
        this.labelScore.text = this.scoreLabel + this.score;
        
        // Let's get rid of both the bullet and the alien that was hit
        projectileCol.kill();
        baddieCol.kill();
        
        
    },
    
    playerHit: function(playerCol, rocketCol) {
        
        if (this.sound) {
            this.baddieDeathSound.play();
        }
        
        playerCol.kill();
        rocketCol.kill();
        
        
        this.game.input.onTap.addOnce(this.restartGame, this);
            this.loseTextToRocket = 'Bummer, you lost. \n You are supposed to avoid those!\n Click the screen to continue!'
            this.loseDisplayToRocket = game.add.text(100, 250, this.loseTextToRocket, { font: "30px Arial", fill: "#ffffff" });
        
        
        
    },
    
    muteSound: function() {
        
        if (this.sound == true) {
            this.sound = false;
            this.muteButton.alpha = 1.5;
        }
        
        else {
            this.sound = true;
            this.muteButton.alpha = .3;
        }
           
    },
    
    restartGame: function() {
        // Restarts game
        game.state.start('hard')
    },
};

game.state.add('title', titleState);
game.state.add('main', mainState);
game.state.add('medium', mediumState);
game.state.add('hard', hardState);
game.state.start('title');


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// main state of game
var mainState = {
    
    // loads game assets
    preload: function() {
        // background color
        game.stage.backgroundColor = '#71c5cf';
        // load asset
        game.load.image('player', 'assets/invader.png');    
        // game.load.image('pipe', 'assets/.png');
    },
    
    // set up game, display sprites, etc
    create: function() {
        // set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // display ship
        this.player = this.game.add.sprite(400, 500, 'player');
        game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5, 0.5); // where the "middle" of the player is
      
        // creating the enemies in a group
        this.baddies = game.add.group(); 
        this.baddies.enableBody = true; // enables collision
        this.baddies.physicsBodyType = Phaser.Physics.ARCADE;
        this.baddies.setAll('anchor.x', 0.5); // needed for collision info
        this.baddies.setAll('anchor.y', 0.5);
        this.baddies.collideWorldBounds=true;
        this.baddies.enableBody
        
        
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
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        
        
        //this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
         
    },
    
    // called 60 times per second contains games logic
    update: function() {
    
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
            shootProjectile();
        }
        
        //
       // if (this.aliens.x > 0 && this.aliens.x < 800)
        
        
    },
    
    createBaddies: function() {
        // add an array of sorts of baddies
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 8; x++){
                this.baddies.create(x * 90,y * 50, 'invader');
            }
        }
        
        this.baddies.x = 70;
        this.baddies.y = 50;
    },
    
    restartGame: function() {
        // Restarts game
        game.state.start('main')
    },
};

game.state.add('main', mainState);
game.state.start('main');


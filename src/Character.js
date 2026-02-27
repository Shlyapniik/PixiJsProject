import * as PIXI from "pixi.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";

export class Character {
    constructor(app, world, onLand) {
        this.app = app;
        this.world = world;
        this.onLand = onLand;

        this.isJumping = false;
        this.jumpProgress = 0;
        this.waitingForCamera = false;
    }

    async init(){
        const atlasData = {
            frames: {
                jump0: {
                    frame: {x: 0, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump1: {
                    frame: {x: 150, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump2: {
                    frame: {x: 750, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump3: {
                    frame: {x: 0, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump4: {
                    frame: {x: 150, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump5: {
                    frame: {x: 300, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump6: {
                    frame: {x: 450, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump7: {
                    frame: {x: 600, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump8: {
                    frame: {x: 750, y: 300, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump9: {
                    frame: {x: 0, y: 450, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump10: {
                    frame: {x: 150, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump11: {
                    frame: {x: 450, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump12: {
                    frame: {x: 600, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump13: {
                    frame: {x: 750, y: 0, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump14: {
                    frame: {x: 0, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump15: {
                    frame: {x: 150, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump16: {
                    frame: {x: 300, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump17: {
                    frame: {x: 450, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                },
                jump18: {
                    frame: {x: 600, y: 150, w: 150, h: 150},
                    sourceSize: {w: 150, h: 150},
                    spriteSourceSize: {x: 0, y: 0, w: 150, h: 150}
                }
            },
            meta: {
                image: '/character/imposter.png',
                size: {w: 1024, h: 1024 }
            },
            animations: {
                jump: ['jump0', 'jump1', 'jump2', 'jump3', 'jump4', 'jump5', 'jump6', 'jump7', 'jump8',
                    'jump9', 'jump10', 'jump11', 'jump12', 'jump13', 'jump14', 'jump15', 'jump16',
                    'jump17', 'jump18'
                 ]
            }
        }

        const texture = await PIXI.Assets.load(atlasData.meta.image);
        const spriteSheet = new PIXI.Spritesheet(texture, atlasData);
        await spriteSheet.parse();

        this.animatedSprite = new PIXI.AnimatedSprite(spriteSheet.animations.jump);
        this.animatedSprite.anchor.set(0.5, 0.5);
        this.world.addChild(this.animatedSprite);
        this.animatedSprite.x = GAME_WIDTH * 0.25;
        this.animatedSprite.y = GAME_HEIGHT * 0.225;

        // Настройки прыжка
        this.jumpDuration = 60; // кадры
        this.jumpHeight = 300;

        // Первый прыжок
        this.startX = this.animatedSprite.x;
        this.startY = this.animatedSprite.y;
        this.endX = GAME_WIDTH * 0.5;
        this.endY = GAME_HEIGHT * 0.75;

        // Отскок
        this.bounceDuration = 60;
        this.bounceHeight = 200;
        this.bounceEndX = GAME_WIDTH * 0.8;
        this.bounceEndY = GAME_HEIGHT * 0.5;   
    }

    startJump() {
        if (this.isJumping || this.waitingForCamera) return;
        this.isJumping = true;
        this.jumpProgress = 0;
        this.jumpPhase = 0;
        this.startX = this.animatedSprite.x;
        this.startY = this.animatedSprite.y;
        this.animatedSprite.play();
        this.animatedSprite.animationSpeed = 0.2;
    }

    update() {
        if (!this.isJumping) return;
        if (this.waitingForCamera) return;

        this.jumpProgress++;
        let t, parabola;

        if (this.jumpPhase == 0){
            t = this.jumpProgress / this.jumpDuration;
            this.animatedSprite.x = this.startX + (this.endX - this.startX) * t;
            parabola = 4 * this.jumpHeight * t * (1-t);
            this.animatedSprite.y = (1-t) * this.startY + t * this.endY - parabola;
        }
        else if (this.jumpPhase == 1){
            t = this.jumpProgress / this.bounceDuration;
            this.animatedSprite.x = this.startX + (this.bounceEndX - this.startX) * t;
            parabola = 4 * this.bounceHeight * t * (1-t);
            this.animatedSprite.y = (1-t) * this.startY + t * this.bounceEndY - parabola;
        }

        // Вращение
        this.animatedSprite.rotation = t * Math.PI * 4;

        if ((this.jumpPhase === 0 && this.jumpProgress >= this.jumpDuration) ||
            (this.jumpPhase === 1 && this.jumpProgress >= this.bounceDuration)) {
            this.finishPhase();
        }
    }

    finishPhase() {
        if (this.jumpPhase === 0) {
            this.waitingForCamera = true;
            this.onLand(() => {
                this.waitingForCamera = false;
                this.jumpPhase = 1;
                this.jumpProgress = 0;
                this.startX = this.endX;
                this.startY = this.endY;
            });
        } else {
            this.waitingForCamera = true;
            this.onLand(() => {
                this.waitingForCamera = false;
                this.isJumping = false;
                this.animatedSprite.rotation = 0;
                this.animatedSprite.x = this.bounceEndX;
                this.animatedSprite.y = this.bounceEndY;
                this.animatedSprite.gotoAndStop(0);
            });
        }
        
    }
}
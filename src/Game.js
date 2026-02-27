import * as PIXI from "pixi.js";
import { Character } from "./Character.js";
import { ClickHandler } from "./ClickHandler.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";
import { sound} from "@pixi/sound";

export class Game {
    constructor() {
        // Создаём приложение без параметров
        this.app = new PIXI.Application();

        this.init();
    }

    async init() {
        await this.app.init({
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: 0x1a1a1a
        });

        await PIXI.Assets.load([
            { alias: "bgm", src: "/sound/bg.mp3" },
            { alias: "jump", src: "/sound/jump.mp3" }
        ]);

        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
        document.body.appendChild(this.app.canvas);

        this.root = new PIXI.Container();
        this.app.stage.addChild(this.root);

        await this.createScene();

        this.setupResize();
    }

    async createScene() {
        // Задний фон
        const texture = await PIXI.Assets.load('/background/background.png');

        this.background = new PIXI.TilingSprite(
            texture,
            GAME_WIDTH,
            GAME_HEIGHT
        );
        const scale = GAME_HEIGHT / texture.height;
        this.background.tileScale.set(scale);

        this.root.addChild(this.background);

        this.world = new PIXI.Container();
        this.root.addChild(this.world);
        
        // Маска, чтобы скрывать объекты
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        mask.endFill();

        this.world.mask = mask;
        this.root.addChild(mask);

        // Интерьер

        // Настенная полка
        const shelfTexture = await PIXI.Assets.load("/interier/shelf.png");
        this.shelf = new PIXI.Sprite(shelfTexture);
        this.shelf.x = GAME_WIDTH * 0.05;
        this.shelf.y = GAME_HEIGHT * 0.3;
        this.world.addChild(this.shelf);

        // Мяч
        const ballTexture = await PIXI.Assets.load("interier/ball.png");
        this.ball = new PIXI.Sprite(ballTexture);
        this.ball.x = GAME_WIDTH * 0.43;
        this.ball.y = GAME_HEIGHT * 0.8;
        this.world.addChild(this.ball);

        // Кресло
        const chairTexture = await PIXI.Assets.load("/interier/chair.png");
        this.chair = new PIXI.Sprite(chairTexture);
        this.chair.x = GAME_WIDTH * 0.6;
        this.chair.y = GAME_HEIGHT * 0.55;
        this.world.addChild(this.chair);

        // Персонаж
        this.character = new Character(this.app, this.world, (callback) => {
            this.moveCamera(200, callback);
        });
        await this.character.init();

        this.clickHandler = new ClickHandler(this.character);
    }

    setupResize() {
        const resize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            this.app.renderer.resize(windowWidth, windowHeight);

            const scale = Math.min(
                windowWidth / GAME_WIDTH,
                windowHeight / GAME_HEIGHT
            );

            this.root.scale.set(scale);

            this.root.x = (windowWidth - GAME_WIDTH * scale) / 2;
            this.root.y = (windowHeight - GAME_HEIGHT * scale) / 2;
        };

        resize();
        window.addEventListener("resize", resize);
    }

    moveCamera(distance, callback) {
        const duration = 30; // кадры
        let progress = 0;
        const startX = this.world.x;
        const targetX = startX - distance;

        const animate = () => {
            progress++;
            const t = progress / duration;
            this.world.x = startX + (targetX - startX) * t;
            this.background.tilePosition.x = -this.world.x * 0.5;

            if (progress >= duration) {
                this.world.x = targetX;
                this.app.ticker.remove(animate);
                if (callback) callback();
            }
        };

        this.app.ticker.add(animate);
    }
}
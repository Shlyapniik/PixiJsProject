import { sound } from "@pixi/sound";

export class ClickHandler {
    constructor(character) {
        this.character = character;
        this.hasClicked = false;
        this.isAnimating = false;
        this.musicStarted = false;

        window.addEventListener("pointerdown", () => this.handleClick());
    }

    handleClick() {
        if (this.isAnimating) return;

        if (!this.hasClicked) {
            if (!this.musicStarted) {
                sound.play("bgm", {
                    loop: true,
                    volume: 0.5
                });
                this.musicStarted = true;
            }
            this.startJumpAnimation();
            this.hasClicked = true;
        } else {
            this.redirectToStore();
        }
    }

    startJumpAnimation() {
        this.isAnimating = true;

        sound.play("jump", {
            volume: 0.8,
            singleInstance: true
        });

        this.character.startJump();

        const ticker = this.character.app.ticker;
        const update = () => {
            this.character.update();
            if (!this.character.isJumping) {
                ticker.remove(update);
                this.isAnimating = false;
            }
        };

        ticker.add(update);
    }

    redirectToStore() {
        window.open("https://www.moloco.com", "_blank");
    }
}
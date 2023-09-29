document.getElementById("start-button").addEventListener("click", init);
function init() {
    setInterval(tick, 10);

    requestAnimationFrame(draw);

    window.setInterval(spawnEnemy, 2500);

    document.body.appendChild(canvas);

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("menu-btn").style.display = "none";
    document.getElementById("main").style.display = "none";
    document.getElementById("nav-bar").style.display = "none";
}

document.getElementById("coins").innerHTML = Number(
    localStorage.getItem("balance")
);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const swirlImg = document.getElementById("swirl");
const coinImg = document.getElementById("coin");

function draw() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);
    ctx.fillStyle = "grey";
    ctx.fillRect(player.x - 50, player.y + 40, player.maxHp, 10);
    ctx.fillStyle = "#000";
    ctx.fillRect(
        player.x - 50,
        player.y + 40,
        100 * (player.hp / player.maxHp),
        10
    );
    for (let i = 0; i < swirls.length; i++) {
        ctx.drawImage(swirlImg, swirls[i].x, swirls[i].y, 25, 25);
    }
    ctx.beginPath();
    ctx.arc(1000, 1000, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.rect(0, 0, 2000, 2000);
    ctx.stroke();
    enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = "#850606";
        ctx.fill();
        for (let i = 0; i < enemies.length; i++) {
            ctx.fillStyle = "grey";
            ctx.fillRect(
                enemies[i].x - 50,
                enemies[i].y + 40,
                enemies[i].maxHp,
                10
            );
            ctx.fillStyle = "#850606";
            ctx.fillRect(
                enemies[i].x - 50,
                enemies[i].y + 40,
                100 * (enemies[i].hp / enemies[i].maxHp),
                10
            );
            var coin = {
                x: enemies[i].x - 12.5,
                y: enemies[i].y - 12.5,
                value: 1,
            };
            if (enemies[i].hp <= 0) {
                coins.push(coin);
                enemies.splice(i, 1);
                player.killCount++;
                i--;
            }
            coins.forEach((coin) => {
                ctx.drawImage(coinImg, coin.x, coin.y, 25, 25);
            });
        }
    });
    if (gameOver) {
        ctx.resetTransform();
        ctx.font = "Bold 60px Courier New";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("You Died!", canvas.width / 2, canvas.height / 2 - 35);
        ctx.fillText(
            "Reload To Try Again",
            canvas.width / 2,
            canvas.height / 2 + 35
        );
        ctx.fillText(
            "Kills: " + player.killCount,
            canvas.width / 2,
            canvas.height / 2 + 105
        );
    }
    if (!gameOver) {
        ctx.resetTransform();
        ctx.fillStyle = "black";
        ctx.font = "16px Courier New";
        ctx.fillText("Health: " + player.hp, 25, 25);
        ctx.fillText("Kills: " + player.killCount, 25, 50);
    }

    requestAnimationFrame(draw);
}
function tick() {
    if (gameOver) return;

    if (keys.w) {
        player.y -= 3;
    }

    if (keys.a) {
        player.x -= 3;
    }

    if (keys.s) {
        player.y += 3;
    }

    if (keys.d) {
        player.x += 3;
    }

    if (player.x >= 1975) {
        player.x = 1975;
    }

    if (player.x <= 25) {
        player.x = 25;
    }

    if (player.y >= 1975) {
        player.y = 1975;
    }

    if (player.y <= 25) {
        player.y = 25;
    }

    if (mouse.down && swirls.length < 69420) {
        castSwirl();
    }

    for (let i = 0; i < swirls.length; i++) {
        swirls[i].x += swirls[i].dx;
        swirls[i].y += swirls[i].dy;
    }

    for (let i = 0; i < swirls.length; i++) {
        if (swirls[i].y < 0 || swirls[i].y > 1975) {
            swirls.splice(i, 1);
            i--;
            continue;
        }

        if (swirls[i].x < 0 || swirls[i].x > 1975) {
            swirls.splice(i, 1);
            i--;
            continue;
        }
    }
    if (castCooldown > 0) castCooldown--;

    for (let i = 0; i < enemies.length; i++) {
        const xDis = player.x - enemies[i].x;
        const yDis = player.y - enemies[i].y;

        const enemyAngle = Math.atan2(yDis, xDis);

        const dx = Math.cos(enemyAngle) * 5;
        const dy = Math.sin(enemyAngle) * 5;

        enemies[i].x += dx;
        enemies[i].y += dy;

        if (xDis == 0 && yDis == 0) {
            enemies[i].x = player.x;
            enemies[i].y = player.y;
        }

        if (xDis >= -3 && xDis <= 3 && yDis >= -3 && yDis <= 3) {
            player.hp -= 1;
        }

        for (let m = 0; m < swirls.length; m++) {
            if (
                enemies[i] &&
                Math.abs(swirls[m].x - (enemies[i].x - 25)) < 25 &&
                Math.abs(swirls[m].y - (enemies[i].y - 25)) < 25
            ) {
                enemies[i].hp -= swirls[m].dmg;
                swirls.splice(m, 1);
            }
        }
    }
    for (let i = 0; i < coins.length; i++) {
        if (
            Math.abs(player.x - coins[i].x) < 25 &&
            Math.abs(player.y - coins[i].y) < 25
        ) {
            player.money++;
            localStorage.setItem("balance", player.money);
            console.log("imposter");
            coins.splice(i, 1);
            i--;
        }
    }
    if (player.hp <= 0) {
        gameOver = true;
        ctx.font = "30px";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("You Died", canvas.width / 2, canvas.height / 2);
        return;
    }
}

var player = {
    x: rand(0, 1950),
    y: rand(0, 1950),
    hp: 100,
    maxHp: 100,
    killCount: 0,
    money: Number(localStorage.getItem("balance")),
};

let gameOver = false;

var swirls = [];

var enemies = [];

let coins = [];

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

let mouse = {
    x: 0,
    y: 0,
    down: false,
};

let castCooldown = 0;

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            keys.w = true;
            break;
        case "a":
            keys.a = true;
            break;
        case "s":
            keys.s = true;
            break;
        case "d":
            keys.d = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            keys.w = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "s":
            keys.s = false;
            break;
        case "d":
            keys.d = false;
            break;
    }
});

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
    mouse.down = true;
});

window.addEventListener("mouseup", (e) => {
    mouse.down = false;
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function castSwirl() {
    if (castCooldown > 0) return;
    castCooldown = 10;

    const xDiff = canvas.width / 2 - mouse.x;
    const yDiff = canvas.height / 2 - mouse.y;

    const angle = Math.atan(yDiff / xDiff);

    var swirl = {
        x: player.x - 12.5,
        y: player.y - 12.5,
        dx: (xDiff < 0 ? 1 : -1) * Math.cos(angle) * 10,
        dy: (xDiff < 0 ? 1 : -1) * Math.sin(angle) * 10,
        dmg: 10,
    };
    swirls.push(swirl);
}

function spawnEnemy() {
    var enemy = {
        x: rand(0, 1950),
        y: rand(0, 1950),
        hp: 100,
        maxHp: 100,
    };
    if (!gameOver) {
        enemies.push(enemy);
    }
}

window.toggleNav = () => {
    document.body.dataset.nav =
        document.body.dataset.nav === "true" ? "false" : "true";
};

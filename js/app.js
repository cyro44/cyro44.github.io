(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const swirlImg = document.createElement("img");
    swirlImg.src = "media/swirl.png";
    const coinImg = document.createElement("img");
    coinImg.src = "media/coin.webp";

    if (localStorage.getItem("damage") == null) {
        localStorage.setItem("damage", 10);
    }

    var player = {
        x: rand(0, 1950),
        y: rand(0, 1950),
        hp:
            localStorage.getItem("health") === null
                ? 100
                : Number(localStorage.getItem("health")),
        maxHp:
            localStorage.getItem("health") === null
                ? 100
                : Number(localStorage.getItem("health")),
        killCount: 0,
        money: Number(localStorage.getItem("balance")),
        speed:
            localStorage.getItem("speed") === null
                ? 3
                : Number(localStorage.getItem("speed")),
        damage: localStorage.getItem("damage"),
        magnetRadius: Number(localStorage.getItem("magnet")),
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
        };
        swirls.push(swirl);
    }

    function spawnEnemy() {
        var enemy = {
            x: rand(0, 1950),
            y: rand(0, 1950),
            hp: Number(localStorage.getItem("enemyHp")) + 100,
            maxHp: Number(localStorage.getItem("enemyHp")) + 100,
            damage: Number(localStorage.getItem("enemyDamage")) + 1,
            speed: Number(localStorage.getItem("enemySpeed")) + 4,
        };
        if (!gameOver) {
            enemies.push(enemy);
        }
    }

    window.toggleNav = () => {
        document.body.dataset.nav =
            document.body.dataset.nav === "true" ? "false" : "true";
    };

    document.querySelector(".shopBtn").addEventListener("click", function () {
        const shop = document.querySelector(".shop");
        shop.style.display = shop.style.display === "none" ? "block" : "none";
        let damageLvl = Number(localStorage.getItem("dmgLvl")) || 0;
        let speedLvl = Number(localStorage.getItem("speedLvl")) || 0;
        let enemyLvl = Number(localStorage.getItem("enemyLvl")) || 0;
        let healthLvl = Number(localStorage.getItem("healthLvl")) || 0;
        let magnetLvl = Number(localStorage.getItem("magnetLvl")) || 0;
        document.getElementById("dmgLvl").innerHTML = "Level: " + damageLvl;
        document.getElementById("speedLvl").innerHTML = "Level: " + speedLvl;
        document.getElementById("enemyLvl").innerHTML = "Level: " + enemyLvl;
        document.getElementById("healthLvl").innerHTML = "Level: " + healthLvl;
        document.getElementById("magnetLvl").innerHTML = "Level: " + magnetLvl;
    });

    const modal = document.getElementsByClassName("shop")[0];
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    const damageUpgrade = document.getElementById("upgradeDamage");
    damageUpgrade.onclick = function () {
        if (player.money < 5 || player.damage >= 20) {
            damageUpgrade.innerHTML = "Too Poor or Max Level";
            return;
        }
        let damageLvl = Number(localStorage.getItem("dmgLvl")) || 0;
        damageLvl++;
        localStorage.setItem("dmgLvl", damageLvl);
        document.getElementById("dmgLvl").innerHTML = "Level: " + damageLvl;
        player.money -= 5;
        localStorage.setItem("balance", player.money);
        localStorage.setItem(
            "damage",
            parseInt(localStorage.getItem("damage")) + 2
        );
    };

    const speedUpgrade = document.getElementById("upgradeSpeed");
    speedUpgrade.onclick = function () {
        if (player.money < 5 || player.speed >= 7) {
            speedUpgrade.innerHTML = "Too Poor or Max Level";
            return;
        }
        let speedLvl = Number(localStorage.getItem("speedLvl")) || 0;
        speedLvl++;
        localStorage.setItem("speedLvl", speedLvl);
        document.getElementById("speedLvl").innerHTML = "Level: " + speedLvl;
        player.speed += 0.5;
        player.money -= 5;
        localStorage.setItem("balance", player.money);
        localStorage.setItem("speed", player.speed);
    };

    const healthUpgrade = document.getElementById("upgradeHealth");
    healthUpgrade.onclick = function () {
        if (player.money < 5 || player.hp >= 300) {
            healthUpgrade.innerHTML = "Too Poor or Max Level";
            return;
        }
        let healthLvl = Number(localStorage.getItem("healthLvl")) || 0;
        healthLvl++;
        localStorage.setItem("healthLvl", healthLvl);
        document.getElementById("healthLvl").innerHTML = "Level: " + healthLvl;
        player.hp += 5;
        player.money -= 5;
        localStorage.setItem("balance", player.money);
        localStorage.setItem("health", player.hp);
    };

    const magnetUpgrade = document.getElementById("upgradeMagnet");
    magnetUpgrade.onclick = function () {
        if (player.money < 5 || player.magnetRadius >= 300) {
            magnetUpgrade.innerHTML = "Too Poor or Max Level";
            return;
        }
        let magnetLvl = Number(localStorage.getItem("magnetLvl")) || 0;
        magnetLvl++;
        localStorage.setItem("magnetLvl", magnetLvl);
        document.getElementById("magnetLvl").innerHTML = "Level: " + magnetLvl;
        player.magnetRadius += 10;
        player.money -= 5;
        localStorage.setItem("balance", player.money);
        localStorage.setItem("magnet", player.magnetRadius);
    };

    const enemyUpgrade = document.getElementById("upgradeEnemy");
    enemyUpgrade.onclick = function () {
        if (player.money < 10 || enemyLvl >= 8) {
            enemyUpgrade.innerHTML = "Too Poor or Max Level";
            return;
        }
        player.money -= 10;
        let enemyLvl = Number(localStorage.getItem("enemyLvl")) || 0;
        enemyLvl++;
        localStorage.setItem("enemyLvl", enemyLvl);
        document.getElementById("enemyLvl").innerHTML = "Level: " + enemyLvl;
        localStorage.setItem("balance", player.money);
        localStorage.setItem(
            "enemyDamage",
            localStorage.getItem("enemyDamage") + 1
        );
        localStorage.setItem(
            "enemySpeed",
            localStorage.getItem("enemySpeed") + 1
        );
        localStorage.setItem("enemyHp", localStorage.getItem("enemyHp") + 5);
        localStorage.setItem(
            "coinValue",
            localStorage.getItem("coinValue") + 2
        );
    };

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(
            canvas.width / 2 - player.x,
            canvas.height / 2 - player.y
        );
        ctx.fillStyle = "grey";
        ctx.fillRect(player.x - 50, player.y + 40, 100, 10);
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
                ctx.fillRect(enemies[i].x - 50, enemies[i].y + 40, 100, 10);
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
                    value: Number(localStorage.getItem("coinValue")) + 1,
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
            player.y -= player.speed;
        }

        if (keys.a) {
            player.x -= player.speed;
        }

        if (keys.s) {
            player.y += player.speed;
        }

        if (keys.d) {
            player.x += player.speed;
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
                player.hp -= enemies[i].damage;
            }

            for (let m = 0; m < swirls.length; m++) {
                if (
                    enemies[i] &&
                    Math.abs(swirls[m].x - (enemies[i].x - 25)) < 25 &&
                    Math.abs(swirls[m].y - (enemies[i].y - 25)) < 25
                ) {
                    enemies[i].hp -= player.damage;
                    swirls.splice(m, 1);
                }
            }
        }

        for (let i = 0; i < coins.length; i++) {
            if (
                Math.abs(player.x - 12.5 - coins[i].x) < 25 &&
                Math.abs(player.y - 12.5 - coins[i].y) < 25
            ) {
                player.money++;
                localStorage.setItem("balance", player.money);
                coins.splice(i, 1);
                i--;
            } else {
                const xDiff = player.x - coins[i].x;
                const yDiff = player.y - coins[i].y;

                const coinAngle = Math.atan2(yDiff, xDiff);

                const dx = Math.cos(coinAngle) * 5;
                const dy = Math.sin(coinAngle) * 5;

                if (Math.abs(xDiff) < player.magnetRadius) {
                    coins[i].x += dx;
                    coins[i].y += dy;
                }
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
})();

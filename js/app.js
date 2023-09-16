document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("start-screen").style.display = "none";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const img = document.getElementById("swirl");

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(
            canvas.width / 2 - player.x,
            canvas.height / 2 - player.y
        );
        for (let i = 0; i < swirls.length; i++) {
            ctx.drawImage(img, swirls[i].x, swirls[i].y, 25, 25);
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
        });

        requestAnimationFrame(draw);
    }

    var player = {
        x: rand(0, 1950),
        y: rand(0, 1950),
        hp: 100,
    };

    var swirls = [];

    var enemies = [];

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
            hp: 100,
        };
        enemies.push(enemy);
    }

    window.setInterval(spawnEnemy, 5000);

    function tick() {
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

            const dx = Math.cos(enemyAngle) * 4;
            const dy = Math.sin(enemyAngle) * 4;

            enemies[i].x += dx;
            enemies[i].y += dy;

            if (xDis == 0 && yDis == 0) {
                enemies[i].x = player.x;
                enemies[i].y = player.y;
            }

            if (enemies[i].hp <= 0) {
                enemies.splice(i, 1);
            }

            for (let m = 0; m < swirls.length; m++) {
                if (
                    Math.abs(swirls[m].x - (enemies[i].x - 25)) < 25 &&
                    Math.abs(swirls[m].y - (enemies[i].y - 25)) < 25
                ) {
                    enemies[i].hp -= 10;
                    swirls.splice(m, 1);
                }
            }
        }
    }

    setInterval(tick, 10);

    requestAnimationFrame(draw);

    document.body.appendChild(canvas);
});

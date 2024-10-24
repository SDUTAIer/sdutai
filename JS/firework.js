(function() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    // 获取Canvas上下文
    const ctx = canvas.getContext('2d');

    // 存储烟花的数组
    let fireworks = [];

    // 设置Canvas样式和位置
    function setCanvasStyle() {
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none'; // 不影响原网页的鼠标事件
    }

    // 设置Canvas大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 初始化Canvas样式和大小
    setCanvasStyle();
    resizeCanvas();

    // 窗口大小改变时重新设置Canvas大小
    window.addEventListener('resize', resizeCanvas);

    // 获取.bottm元素
    const bottmDiv = document.querySelector('.bottm');

    // 在.bottm区域内监听点击事件
    bottmDiv.addEventListener('click', function(event) {
        // 获取点击位置相对于视口的坐标
        const rect = bottmDiv.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        // 检查点击是否在.bottm区域内
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            createFirework(x, y);
        }
    });

    // 创建烟花函数
    function createFirework(x, y) {
        fireworks.push(new Firework(x, y));
    }

    // 烟花对象构造函数
    function Firework(x, y) {
        this.particles = [];

        // 创建烟花粒子
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(x, y));
        }

        // 更新和绘制烟花粒子
        this.update = function() {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                this.particles[i].draw();
            }
        }
    }

    // 烟花粒子对象构造函数
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;

        // 更新粒子位置和透明度
        this.update = function() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.02;
        }

        // 绘制粒子
        this.draw = function() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新和绘制烟花
        for (let i = 0; i < fireworks.length; i++) {
            fireworks[i].update();
        }

        // 清除已消失的烟花
        fireworks = fireworks.filter(function(firework) {
            return firework.particles.some(p => p.alpha > 0);
        });
    }

    animate();

})();
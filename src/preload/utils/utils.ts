import { screen } from "electron";
/* 自定义窗口移动 */
class AzCustomWindowMove {
    // 是否开启
    isOpen: boolean;
    // 传入要处理的窗口
    win: any;
    // 窗口偏移
    winStartPosition: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    // 现在鼠标所在位置
    startPosition: {
        x: number;
        y: number;
    };
    constructor() {
        this.isOpen = false;
        this.win = null;
        this.winStartPosition = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        this.startPosition = {
            x: 0,
            y: 0,
        };
    }
    init(win: any) {
        this.win = win;
    }
    start() {
        this.isOpen = true;
        // 获取当前窗口偏移[x, y]
        const winPosition = this.win.getPosition();
        // 获取当前缩放[width, height]
        const winSize = this.win.getSize();
        this.winStartPosition.x = winPosition[0];
        this.winStartPosition.y = winPosition[1];
        this.winStartPosition.width = winSize[0];
        this.winStartPosition.height = winSize[1];
        // 获取鼠标绝对位置
        const mouseStartPosition = screen.getCursorScreenPoint();
        this.startPosition.x = mouseStartPosition.x;
        this.startPosition.y = mouseStartPosition.y;
        // 开启刷新
        this.move();
    }
    move() {
        if (!this.isOpen) {
            return;
        }
        // 如果窗口已销毁
        if (this.win.isDestroyed()) {
            this.end();
            return;
        }
        // 判断窗口是否聚焦
        if (!this.win.isFocused()) {
            this.end();
            return;
        }
        const cursorPosition = screen.getCursorScreenPoint();
        const x =
            this.winStartPosition.x + cursorPosition.x - this.startPosition.x;
        const y =
            this.winStartPosition.y + cursorPosition.y - this.startPosition.y;
        // this.win.setPosition(120, 120, false);
        // this.win.setBounds({x: 120, y: 120})
        // 更新位置的同时设置窗口原大小， windows上设置=>显示设置=>文本缩放 不是100%时，窗口会拖拽放大
        this.win.setBounds({
            x: x,
            y: y,
            width: this.winStartPosition.width,
            height: this.winStartPosition.height,
        });
        setTimeout(() => {
            this.move();
        }, 0);
    }
    end() {
        this.isOpen = false;
    }
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child);
        }
        return null;
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child);
        }
        return null;
    },
};
function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
@keyframes square-spin {
25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
animation-fill-mode: both;
width: 50px;
height: 50px;
background: #fff;
animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
background: #282c34;
z-index: 9;
}
  `;
    const oStyle = document.createElement("style");
    const oDiv = document.createElement("div");

    oStyle.id = "app-loading-style";
    oStyle.innerHTML = styleContent;
    oDiv.className = "app-loading-wrap";
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        },
    };
}

export { AzCustomWindowMove, useLoading };

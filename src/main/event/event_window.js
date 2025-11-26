import { AzCustomWindowMove } from "../utils/utils";

function event_window(ipcMain, win) {
    const moveable_window = new AzCustomWindowMove();
    moveable_window.init(win);
    // 窗口拖动开始
    ipcMain.on("win:drag_start", (data) => {
        win.unmaximize();
        win.setSize(1200, 800);
        // console.log("drag_start");
        moveable_window.start();
    });
    // 窗口拖动结束
    ipcMain.on("win:drag_end", (data) => {
        moveable_window.end();
        // console.log("windows_drag_end");
    });
    // 最小化窗口
    ipcMain.on("win:minimize", (data) => {
        win.minimize();
        // console.log("minimize");
    });
    // 隐藏窗口
    ipcMain.on("win:hide", (data) => {
        win.hide();
        // console.log("hide");
    });
    // 最大化或还原窗口
    ipcMain.on("win:cropsquare", (data) => {
        let wh = win.getSize();
        if (wh[0] === 1200 && wh[1] === 800) {
            win.maximize();
        } else {
            win.unmaximize();
            win.setSize(1200, 800);
        }
    });
    // 关闭窗口
    ipcMain.on("win:close", (data) => {
        win.close();
        win.destroy();
    });
}

export { event_window };

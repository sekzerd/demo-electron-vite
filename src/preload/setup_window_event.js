import { AzCustomWindowMove } from "./utils/utils";

function setup_window_event(ipcMain, win) {
    const moveable_window = new AzCustomWindowMove();
    moveable_window.init(win);

    ipcMain.on("app:windows_drag_start", (data) => {
        win.unmaximize();
        win.setSize(1200, 800);
        console.log("windows_drag_start");
        moveable_window.start();
    });

    ipcMain.on("app:windows_drag_end", (data) => {
        moveable_window.end();
        console.log("windows_drag_end");
    });

    ipcMain.on("app:minimize", (data) => {
        win.minimize();
        console.log("minimize");
    });
    
    ipcMain.on("app:hide", (data) => {
        win.hide();
        console.log("hide");
    });
    
    ipcMain.on("app:cropsquare", (data) => {
        let wh = win.getSize();
        if (wh[0] === 1200 && wh[1] === 800) {
            win.maximize();
        } else {
            win.unmaximize();
            win.setSize(1200, 800);
        }
    });

    ipcMain.on("app:close", (data) => {
        win.close();
        win.destroy();
    });
}

export { setup_window_event };

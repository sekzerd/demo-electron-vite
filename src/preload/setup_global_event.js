function setup_global_event(ipcMain){
    ipcMain.handle("app:invoke_add", (event,data) => {
        console.log("invoke_add receive:",data);
        const ret = data + 1;
        return Promise.resolve(ret);
    });
}

export { setup_global_event };
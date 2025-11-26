import koffi from 'koffi';
import path from 'path';
function testKoffi(a, b, app) {
    let extra_resource_root = path.resolve(app.getAppPath());

    if (app.isPackaged) {
        extra_resource_root = path.dirname(extra_resource_root);
        extra_resource_root = path.resolve(extra_resource_root, "extraResources");
        let dll_root = path.resolve(extra_resource_root, "dlls");
        let demo_dll = koffi.load(dll_root + "/demo_dll.dll");
        console.log('unpacked Resources Root:', dll_root);
        const myadd = demo_dll.func('__stdcall', 'myadd', 'int', ['int', 'int']);
        let ret = myadd(a, b);
        return ret;
    } else {
        extra_resource_root = path.resolve(extra_resource_root, "build/extraResources");
        let dll_root = path.resolve(extra_resource_root, "dlls");
        let demo_dll = koffi.load(dll_root + "/demo_dll.dll");
        console.log('unpacked Resources Root:', dll_root);
        const myadd = demo_dll.func('__stdcall', 'myadd', 'int', ['int', 'int']);
        let ret = myadd(a, b);
        return ret;
    }
}

function setup_global_event(ipcMain, app) {
    ipcMain.handle("app:invoke_add", (event, data) => {
        console.log("invoke_add receive:", data);
        const ret = data + 1;
        return Promise.resolve(ret);
    });
    ipcMain.handle("test-koffi", (event, a, b) => {
        console.log('main test-koffi received');
        console.log('a=', a, 'b=', b);
        const ret = testKoffi(a, b, app);
        return Promise.resolve(ret);
    });
}

export { setup_global_event };
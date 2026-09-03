
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const clock_demo = function services_clockDemo():void {
    if (vars.options.demo === true) {
        const time:number = vars.environment.demo_kill - Date.now();
        if (time < 0) {
            const payload:services_status_clock_demo = {remaining: "00:00"};
            broadcast(vars.id.dashboard_server, "dashboard", {
                data: payload,
                service: "services_status_clock_demo"
            });
            setTimeout(function services_clockDemo_kill() {
                process.exit(0);
            }, 50);
        } else {
            const minute:number = Math.floor(time / 60000),
                seconds:number = (time % 60000) / 1000,
                seconds_str:string[] = seconds.toString().split("."),
                seconds_sup:string = (seconds_str[0].length === 1)
                    ? `0${seconds_str[0]}`
                    : seconds_str[0],
                // seconds_sub:string = (seconds_str[1] === undefined)
                //     ? "000"
                //     : (seconds_str[1].length === 1)
                //         ? `${seconds_str[1]}00`
                //         : (seconds_str[1].length === 2)
                //             ? `${seconds_str[1]}0`
                //             : seconds_str[1],
                payload:services_status_clock_demo = {remaining: `0${minute}:${seconds_sup}`};
            broadcast(vars.id.dashboard_server, "dashboard", {
                data: payload,
                service: "services_status_clock_demo"
            });
            setTimeout(services_clockDemo, 975);
        }
    }
};

export default clock_demo;
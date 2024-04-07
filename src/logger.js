export default class Logger{ 
    log(level, message, style) {
        const output = `%c[${level}] [${new Date().toISOString().replace('T', ' ').split('.')[0]}] ${message}`
        console.log(output, style)
    }

    info(message) {
        this.log("INF", message, "color: green;")
    }

    error(message) {
        this.log("Err", message, "color: red;")
    }

    debug(message) {
        this.log("DEB", message, "color: deepskyblue;")
    }

    debug_a(message) {
        this.log("DEB", message, "color: skyblue;")
    }

    debug_b(message) {
        this.log("DEB", message, "color: dodgerblue;")
    }

}
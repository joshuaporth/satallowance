import { DotLottie } from "@lottiefiles/dotlottie-web";
import { QRCodeStyling } from "qr-code-styling/lib/qr-code-styling.common.js";
import { confetti } from "@tsparticles/confetti";
import * as toastr from "toastr";
import * as qrCodeOptions from "../assets/qr-code-options.json";
import * as emojiSets from "./emojis.json";

const loading = document.getElementById("loading");
const waitingOnSatscard = document.getElementById("waiting-on-satscard");
const bitcoinAddress = document.getElementById("bitcoin-address");
const satsCelebration = document.getElementById("sats-celebration");
const satsValue = document.getElementById("sats-value");

const qsp = new URLSearchParams(window.location.search);
const defaultEmojiSet = "rumblerushgalaxy";
const emojiSet = emojiSets[(qsp.get("emojiSet") ?? defaultEmojiSet).toLocaleLowerCase()] ?? emojiSets[defaultEmojiSet];
const runDemo = (qsp.get("demo") ?? "false").toLocaleLowerCase() === "true";

toastr.options.preventDuplicates = true;
toastr.options.timeOut = 0;
toastr.options.extendedTimeOut = 0;

const generateQRCode = (addr) => {
    const options = structuredClone(qrCodeOptions);
    options.data = `bitcoin:${addr}`;
    const qrCode = new QRCodeStyling(options);
    qrCode.append(document.getElementById("bitcoin-address"));
};

const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
};

const sample = (arr, size) => {
    const s = structuredClone(arr);
    var length = arr.length;
    size = Math.max(Math.min(size, length), 0);
    var last = length - 1;
    for (var i = 0; i < size; i++) {
        var rand = Math.floor(randomInRange(i, length - 1));
        var temp = s[i];
        s[i] = s[rand];
        s[rand] = temp;
    }
    return s.slice(0, size);
};

const generateConfetti = (emojis) => {
    const duration = 10 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 19 * (timeLeft / duration);

        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.02, 0.98), y: randomInRange(0, 0.4) },
                scalar: 3,
                shapes: ["emoji"],
                shapeOptions: {
                    emoji: {
                        value: sample(emojis, 2),
                    },
                },
            })
        );
    }, 250);
    return interval;
};

const showLoadingPage = () => {
    waitingOnSatscard.classList.add("hidden");
    loading.classList.remove("hidden");
}

const showWaitingOnSatscardPage = () => {
    loading.classList.add("hidden");
    const logo = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: document.querySelector("#lottie-canvas"),
        src: "./assets/waiting-on-satscard.json",
    });
    waitingOnSatscard.classList.remove("hidden");
    waitingOnSatscard.classList.add("fade-in");
};

const showBitcoinAddressPage = (addr) => {
    waitingOnSatscard.classList.add("fade-out");
    setTimeout(() => {
        generateQRCode(addr);
        waitingOnSatscard.classList.add("hidden");
        bitcoinAddress.classList.remove("hidden");
        bitcoinAddress.classList.add("fade-in");
    }, 750);
};

const showSatsCelebrationPage = (sats) => {
    const satsString = sats.toLocaleString().replace(",", " ");
    satsValue.textContent = `${satsString} sats`;
    bitcoinAddress.classList.add("fade-out");
    setTimeout(() => {
        bitcoinAddress.classList.add("hidden");
        satsCelebration.classList.remove("hidden");
        satsCelebration.classList.add("stack");
        satsCelebration.classList.add("fade-in");
        setTimeout(() => {
            generateConfetti(emojiSet);
        }, 350);
    }, 1000);
}

const demo = () => {
    showWaitingOnSatscardPage();
    setTimeout(() => {
        showBitcoinAddressPage("bc1q4mjvk5zyszzqnw8nmathjj9660v3h8p78u03kr");
        setTimeout(() => {
            showSatsCelebrationPage(5000, emojiSets["rumblerushgalaxy"]);
        }, 2500);
    }, 2500);

};

const tryParseJSON = (maybeJSON) => {
    try {
        return JSON.parse(maybeJSON);
    } catch (e) {
        return undefined;
    }
}

const connectToTapServer = (attempt = 0) => {
    showLoadingPage();

    let waitingOnTapServer = setTimeout(() => {
        toastr.clear();
        setTimeout(showWaitingOnSatscardPage, 1000);
        waitingOnTapServer = null;
    }, Math.min(1000 + (attempt * 1000), 30000));

    const server = new WebSocket("ws://localhost:8080");

    function handleCloseEvent(event) {
        clearTimeout(waitingOnTapServer);
        console.error(`Connection to Tap Server closed with close code ${event.code} and close eeason "${event.reason}"`);
        if (event.reason) {
            setTimeout(() => toastr.error(event.reason), 500);
        } else {
            setTimeout(() => toastr.error("Can't connect to the Tap Server."), 500);
        }
        setTimeout(() => connectToTapServer(attempt + 1));
    }

    server.addEventListener("close", handleCloseEvent);

    server.addEventListener("message", (event) => {
        if (waitingOnTapServer) {
            clearTimeout(waitingOnTapServer);
            waitingOnTapServer = null;
            toastr.clear();
            setTimeout(showWaitingOnSatscardPage, 500);
        }
        const obj = tryParseJSON(event.data);
        if (obj && obj.type === "address") {
            console.debug(`Received address from tap server: ${obj.message}`);
            showBitcoinAddressPage(obj.message);
            connectToMempoolSpace(obj.message);
            server.removeEventListener("close", handleCloseEvent);
            server.close();
        } else if (!obj) {
            console.error(`Received unknown/invalid message from tap server`)
        }
    });
};

const connectToMempoolSpace = (addr) => {
    const mempool = new WebSocket("wss://mempool.space/api/v1/ws");

    mempool.addEventListener("open", () => {
        mempool.send(JSON.stringify({ "track-mempool": true }));
    });

    mempool.addEventListener("message", (event) => {
        const txData = tryParseJSON(event.data);
        if (txData) {
            let vout;
            txData["mempool-transactions"]?.added?.find((tx) => {
                vout = tx.vout.find((vout) => vout.scriptpubkey_address === addr);
                return vout;
            })
            if (vout) {
                console.debug(`Transaction for ${vout.value} sats found in mempool.`);
                showSatsCelebrationPage(vout.value)
                mempool.close();
            }
        }
    });
};

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(() => {
    if (runDemo) {
        demo();
    } else {
        connectToTapServer();
    }
});
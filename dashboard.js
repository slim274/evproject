function updateTariff(){

const hour=new Date().getHours();

let tariff;

let period;

if(hour>=9 && hour<17){

tariff=400;

period="Day Tariff (9:00 AM - 5:00 PM)";

}else{

tariff=450;

period="Night Tariff (5:00 PM - 9:00 AM)";

}

document.getElementById("tariffPrice").innerHTML=tariff;

document.getElementById("tariffPeriod").innerHTML=period;

}

updateTariff();




// ===============================
// START CHARGING DEMO
// ===============================

function startChargingDemo() {

    const reader = document.getElementById("nfcReader");
    const status = document.getElementById("readerStatus");

    // Prevent multiple clicks
    reader.onclick = null;

    // Start NFC wave animation
    reader.classList.add("reading");

    status.textContent = "Searching for RFID Card...";

    setTimeout(() => {

        status.textContent = "RFID Card Detected";
        activateStep("ocpp1", "RFID UID received");

    }, 2000);

    setTimeout(() => {

        status.textContent = "Authorizing...";
        activateStep("ocpp2", "Wallet Authorized");

    }, 4000);

    setTimeout(() => {

        status.textContent = "Preparing Charger...";
        activateStep("ocpp3", "Charging Session Opened");

    }, 6000);

    setTimeout(() => {

        status.textContent = "⚡ Charging Started";

        activateStep("ocpp4", "Streaming Meter Values");

        reader.classList.remove("reading");

        document.getElementById("chargingSession").style.display = "block";

        startChargingSession();

    }, 8000);

}


// ===============================
// CHARGING SESSION
// ===============================

let seconds = 0;
let energy = 0;
let percent = 0;

function startChargingSession() {

    const progress = document.getElementById("progressBar");

    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    progress.style.strokeDasharray = circumference;

    // Get the current tariff automatically
    const tariff = parseInt(document.getElementById("tariffPrice").textContent);

    const timer = setInterval(() => {

        seconds++;
        energy += 0.05;

     if (percent < 100) {

    percent++;

} else {

    clearInterval(timer);

    activateStep("ocpp5", "Transaction Closed");

    // Hide charging session
    document.getElementById("chargingSession").style.display = "none";

    // Fill completion card
    document.getElementById("completeTime").textContent =
        document.getElementById("elapsed").textContent;

    document.getElementById("completeEnergy").textContent =
        document.getElementById("energy").textContent;

    document.getElementById("completeCost").textContent =
        document.getElementById("cost").textContent;

    document.getElementById("completeTariff").textContent =
        tariff;

    // Example wallet calculation
    const totalCost = energy * tariff;
    const remaining = 150000 - totalCost;

    document.getElementById("walletBalance").textContent =
        "₦" + remaining.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    // Show completion screen
    document.getElementById("chargingComplete").style.display = "block";

    document.getElementById("chargingComplete").scrollIntoView({
        behavior: "smooth"
    });

    return;

}
        document.getElementById("elapsed").textContent =
            new Date(seconds * 1000)
                .toISOString()
                .substring(14, 19);

        document.getElementById("energy").textContent =
            energy.toFixed(2) + " kWh";

        document.getElementById("cost").textContent =
            "₦" + (energy * tariff).toFixed(2);

        document.getElementById("batteryPercent").textContent =
            percent + "%";

        progress.style.strokeDashoffset =
            Math.max(
                0,
                circumference - (percent / 100) * circumference
            );

    }, 1000);

}


// ===============================
// OCPP TIMELINE
// ===============================

function activateStep(id, text) {

    const item = document.getElementById(id);

    item.classList.add("active");

    item.querySelector("p").textContent = text;

}


function openReceipt(){

    document.getElementById("receiptTime").textContent =
        document.getElementById("completeTime").textContent;

    document.getElementById("receiptEnergy").textContent =
        document.getElementById("completeEnergy").textContent;

    document.getElementById("receiptCost").textContent =
        document.getElementById("completeCost").textContent;

    document.getElementById("receiptTariff").textContent =
        "₦" +
        document.getElementById("completeTariff").textContent +
        "/kWh";

    document.getElementById("receiptModal").style.display="flex";

}

function closeReceipt(){

    document.getElementById("receiptModal").style.display="none";

}
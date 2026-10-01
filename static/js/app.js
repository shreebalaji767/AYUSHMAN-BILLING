/* BLSSNVJ21 Ayushman Billing — stable client runtime */
"use strict";

const APP_VERSION = "2026.10.7";
const BILL_SCHEMA_VERSION = 4;
const STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_BILLING_DRAFT_V1";

let rowSequence = 0;
let billDirty = false;
let installPrompt = null;

const $ = (id) => document.getElementById(id);

function storageAvailable() {
    try {
        const key = "__blssnvj21_test__";
        localStorage.setItem(key, "1");
        localStorage.removeItem(key);
        return true;
    } catch (_) {
        return false;
    }
}

function setStatus(message, state = "ready") {
    const el = $("storageStatus");
    if (!el) return;
    el.textContent = message;
    el.dataset.state = state;
}

function markDirty() {
    billDirty = true;
    setStatus("Unsaved changes", "dirty");
    const save = $("saveBillBtn");
    if (save) save.textContent = "Save";
}

function markClean(message = "Saved to browser storage") {
    billDirty = false;
    setStatus(message, "saved");
}

function value(id) {
    const el = $(id);
    return el ? el.value : "";
}

function setValue(id, valueToSet) {
    const el = $(id);
    if (el) el.value = valueToSet ?? "";
}

function rowData(row) {
    const inputs = [...row.querySelectorAll("input")];
    return {
        packageCode: inputs[0]?.value || "",
        packageType: inputs[1]?.value || "",
        procedureCost: inputs[2]?.value || "",
        stratificationCost: inputs[3]?.value || "",
        qty: inputs[4]?.value || "",
        packageCost: inputs[5]?.value || "",
        adjustmentFactor: inputs[6]?.value || "",
        incentives: inputs[7]?.value || "",
        totalAmount: inputs[8]?.value || "",
        remarks: inputs[9]?.value || ""
    };
}

function getDraft() {
    const patientIds = [
        "ipdNo","uhid","patientName","age","sdwo",
        "gender","maritalStatus","admissionDate","diagnosis","address"
    ];
    const totalIds = [
        "totalPackageWithoutIncentives",
        "totalAdjustedPackageAmount",
        "totalPayableAmount",
        "eRupiAmount",
        "miscellaneousAmount"
    ];

    const draft = { patient: {}, totals: {}, remarks: value("billRemarks"), rows: [] };

    patientIds.forEach((id) => { draft.patient[id] = value(id); });
    totalIds.forEach((id) => { draft.totals[id] = value(id); });

    document.querySelectorAll("#billingBody .billing-row").forEach((row) => {
        draft.rows.push(rowData(row));
    });

    draft.meta = {
        app: "BLSSNVJ21",
        version: APP_VERSION,
        schemaVersion: BILL_SCHEMA_VERSION,
        savedAt: new Date().toISOString()
    };
    return draft;
}

function saveDraft() {
    try {
        if (!storageAvailable()) throw new Error("localStorage unavailable");
        const serialized = JSON.stringify(getDraft());
        localStorage.setItem(STORAGE_KEY, serialized);

        if (localStorage.getItem(STORAGE_KEY) !== serialized) {
            throw new Error("storage verification failed");
        }

        const button = $("saveBillBtn");
        if (button) {
            button.textContent = "Saved ✓";
            button.dataset.saved = "true";
        }
        markClean();
    } catch (error) {
        console.error("BLSSNVJ21 save error:", error);
        setStatus("Save failed — browser storage unavailable", "error");
    }
}

function createInput(valueToSet, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = valueToSet ?? "";
    input.placeholder = placeholder;
    input.autocomplete = "off";
    input.spellcheck = false;
    return input;
}

function addRow(data = {}, focus = true) {
    const body = $("billingBody");
    if (!body) return null;

    rowSequence += 1;
    const row = document.createElement("tr");
    row.className = "billing-row";
    row.dataset.row = String(rowSequence);

    const number = document.createElement("td");
    number.className = "row-number";
    row.appendChild(number);

    const fields = [
        ["packageCode", "Package Code"],
        ["packageType", "Package Type"],
        ["procedureCost", "Procedure Cost"],
        ["stratificationCost", "Stratification Cost"],
        ["qty", "Qty"],
        ["packageCost", "Package Cost"],
        ["adjustmentFactor", "Adj. Factor"],
        ["incentives", "Incentives"],
        ["totalAmount", "Total Amount"],
        ["remarks", "Remarks"]
    ];

    fields.forEach(([key, placeholder]) => {
        const td = document.createElement("td");
        td.appendChild(createInput(data[key], placeholder));
        row.appendChild(td);
    });

    const action = document.createElement("td");
    action.className = "action-column";

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-row";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteRow(row));

    action.appendChild(del);
    row.appendChild(action);
    body.appendChild(row);

    renumberRows();
    markDirty();

    if (focus) {
        const first = row.querySelector("input");
        if (first) setTimeout(() => first.focus(), 0);
    }

    return row;
}

function deleteRow(row) {
    const body = $("billingBody");
    if (!body || !row) return;

    if (body.querySelectorAll(".billing-row").length <= 1) {
        row.querySelectorAll("input").forEach((input) => { input.value = ""; });
    } else {
        row.remove();
    }

    renumberRows();
    markDirty();
}

function renumberRows() {
    document.querySelectorAll("#billingBody .billing-row").forEach((row, index) => {
        const number = row.querySelector(".row-number");
        if (number) number.textContent = String(index + 1);
    });
}

function clearBill(confirmFirst = true) {
    if (confirmFirst && !window.confirm("Clear all patient information, billing rows and totals?")) {
        return;
    }

    [
        "ipdNo","uhid","patientName","age","sdwo","gender",
        "maritalStatus","admissionDate","diagnosis","address","billRemarks"
    ].forEach((id) => setValue(id, ""));

    [
        "totalPackageWithoutIncentives",
        "totalAdjustedPackageAmount",
        "totalPayableAmount",
        "eRupiAmount",
        "miscellaneousAmount"
    ].forEach((id) => setValue(id, "₹0.00"));

    const body = $("billingBody");
    if (body) body.innerHTML = "";
    rowSequence = 0;
    addRow({}, false);

    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    billDirty = false;
    setStatus("New bill — not saved", "ready");
    const save = $("saveBillBtn");
    if (save) save.textContent = "Save";
}

function restoreDraft() {
    if (!storageAvailable()) {
        setStatus("Browser storage unavailable", "error");
        return false;
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;

        const draft = JSON.parse(raw);
        if (!draft || typeof draft !== "object") {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }

        if (draft.meta?.app && draft.meta.app !== "BLSSNVJ21") {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }

        Object.entries(draft.patient || {}).forEach(([id, v]) => setValue(id, v));
        Object.entries(draft.totals || {}).forEach(([id, v]) => setValue(id, v));
        setValue("billRemarks", draft.remarks || "");

        const body = $("billingBody");
        if (!body) return false;

        body.innerHTML = "";
        rowSequence = 0;

        const rows = Array.isArray(draft.rows) && draft.rows.length ? draft.rows : [{}];
        rows.forEach((row) => addRow(row, false));

        renumberRows();
        markClean("Saved bill restored");
        return true;
    } catch (error) {
        console.error("BLSSNVJ21 restore error:", error);
        setStatus("Saved bill could not be restored", "error");
        return false;
    }
}

function printBill() {
    window.print();
}

function bindUI() {
    $("addRowBtn")?.addEventListener("click", () => addRow());
    $("addBillingRowBtn")?.addEventListener("click", () => addRow());
    $("saveBillBtn")?.addEventListener("click", saveDraft);
    $("printBtn")?.addEventListener("click", printBill);

    $("newBillBtn")?.addEventListener("click", () => clearBill(true));

    $("installPwaBtn")?.addEventListener("click", async () => {
        if (!installPrompt) return;
        try {
            installPrompt.prompt();
            await installPrompt.userChoice;
        } catch (error) {
            console.warn("PWA install prompt failed:", error);
        }
        installPrompt = null;
        const button = $("installPwaBtn");
        if (button) button.hidden = true;
    });

    document.addEventListener("input", (event) => {
        if (event.target.matches("input, textarea, select")) markDirty();
    });

    document.addEventListener("change", (event) => {
        if (event.target.matches("input, textarea, select")) markDirty();
    });

    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
            event.preventDefault();
            saveDraft();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
            event.preventDefault();
            printBill();
            return;
        }

        if (event.key !== "Enter" || !event.target.closest("#billingTable")) return;
        if (event.target.tagName === "TEXTAREA") return;

        const row = event.target.closest(".billing-row");
        if (!row) return;

        const inputs = [...row.querySelectorAll("input")];
        const index = inputs.indexOf(event.target);

        if (index >= 0 && index < inputs.length - 1) {
            event.preventDefault();
            inputs[index + 1].focus();
        } else if (index === inputs.length - 1) {
            event.preventDefault();
            addRow();
        }
    });

    window.addEventListener("beforeunload", (event) => {
        if (!billDirty) return;
        event.preventDefault();
        event.returnValue = "";
    });

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        installPrompt = event;
        const button = $("installPwaBtn");
        if (button) button.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        const button = $("installPwaBtn");
        if (button) button.hidden = true;
    });
}

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
        console.warn("BLSSNVJ21 service worker registration failed:", error);
    });
}

function startApp() {
    try {
        bindUI();
        const restored = restoreDraft();

        if (!restored && !$("billingBody")?.querySelector(".billing-row")) {
            addRow({}, false);
            billDirty = false;
            setStatus("Ready — not saved", "ready");
        }

        registerServiceWorker();
    } catch (error) {
        console.error("BLSSNVJ21 startup error:", error);
        setStatus("Application startup error — check browser console", "error");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
    startApp();
}
